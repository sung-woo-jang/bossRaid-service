import {
  BadRequestException,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CreateBossRaidDto } from './dto/create-boss-raid.dto';
import { UpdateBossRaidDto } from './dto/update-boss-raid.dto';
import { BossRaidRecord } from './entities/boss-raid-record.entity';
import { BossRaid } from './entities/boss-raid.entity';
import { HttpService } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';

interface Level {
  level: number;
  score: number;
}

interface BossRaidStaticData {
  // 제한 시간 (sec)
  bossRaidLimitSeconds: number;

  //레벨 별 레이드 처치 점수
  levels: Level[];
}

@Injectable()
export class BossRaidService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
    @InjectRepository(BossRaidRecord)
    private readonly bossRaidRecordRepository: Repository<BossRaidRecord>,
    @InjectRepository(BossRaid)
    private readonly bossRaidRepository: Repository<BossRaid>,
    private dataSource: DataSource,
    private httpService: HttpService,
  ) {}

  async onModuleInit() {
    const URL = `https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json`;
    try {
      const staticData = (await this.httpService.axiosRef.get(URL)).data;
      await this.cacheManager.set(
        'bossRaidStaticData',
        staticData.bossRaids[0],
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createBossRaid(createBossRaidDto: CreateBossRaidDto) {
    const { level, userId } = createBossRaidDto;
    const user = await this.userService.findUserById(userId);

    // Todo: level 유효성 검사

    let bossRaid = await this.bossRaidRepository
      .createQueryBuilder('boss_raid')
      .orderBy('boss_raid.enteredAt', 'DESC')
      .getOne();

    // - 아무도 보스레이드를 시작한 기록이 없다면 시작 가능
    if (!bossRaid) {
      bossRaid = (
        await this.bossRaidRepository
          .createQueryBuilder()
          .insert()
          .into(BossRaid)
          .values({
            canEnter: true,
            userId: user.id,
          })
          .execute()
      ).raw[0];
    } else {
      const { canEnter, enteredAt } = bossRaid;

      const {
        nextEnterTime, //다음 입장 가능 시간
        currentTime, // 지금 시간
      } = await this.getEnterTime(enteredAt);

      // 마지막 유저가 보스레이드를 종료했거나, 레이드 제한 시간을 초과했는지 판별
      if (!(canEnter || currentTime > nextEnterTime))
        return { isEntered: false };
    }
    const currentTime = new Date();

    await this.dataSource
      .createQueryBuilder()
      .setLock('pessimistic_read')
      .update(BossRaid)
      .set({
        canEnter: false,
        userId,
        enteredAt: new Date(currentTime),
      })
      .where('id = :id', { id: bossRaid.id })
      .execute();

    // 레이드 기록 생성
    const raidRecord = await this.bossRaidRecordRepository
      .createQueryBuilder()
      .insert()
      .into(BossRaidRecord)
      .values({
        level,
        user,
        enterTime: new Date(currentTime),
      })
      .execute();

    return { raidRecord: raidRecord.raw[0].id, isEntered: true };
  }

  async getEnterTime(lastEnterTime: Date) {
    const currentTime = new Date();

    const { bossRaidLimitSeconds } =
      await this.cacheManager.get<BossRaidStaticData>('bossRaidStaticData');

    const nextEnterTime = new Date(
      lastEnterTime.setSeconds(
        lastEnterTime.getSeconds() + bossRaidLimitSeconds,
      ),
    );

    return { nextEnterTime, currentTime };
  }

  async updateRaidStatus(updateBossRaidDto: UpdateBossRaidDto) {
    const currentTime = new Date();

    // 레이드 종료 처리.
    // - 레이드 레벨에 따른 score 반영
    const { id: raidRecordId, userId } = updateBossRaidDto;
    let staticData: BossRaidStaticData;
    try {
      // level에 따른 score 반영을 위해 캐시에서 boss raid static data get
      staticData = await this.cacheManager.get('bossRaidStaticData');
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 유효성 검사
    // - 저장된 userId와 raidRecordId가 일치하지 않는다면 예외 처리
    const record = await this.bossRaidRecordRepository
      .createQueryBuilder('boss_raid_record')
      .leftJoinAndSelect('boss_raid_record.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('boss_raid_record.id =:raidRecordId', { raidRecordId })
      .getOne();

    if (!record)
      throw new HttpException('유효성 검사 실패', HttpStatus.NOT_FOUND);
    if (record.endTime)
      throw new BadRequestException('이미 종료된 레이드 입니다.');
    // - 시작한 시간으로부터 레이드 제한시간이 지났다면 예외처리

    const secondsDiff = Math.floor(
      (currentTime.valueOf() - record.enterTime.valueOf()) / 1000,
    );
    if (secondsDiff > staticData.bossRaidLimitSeconds)
      throw new BadRequestException(
        '요청된 게임 지속 시간이 제한 시간을 초과했습니다.',
      );

    const score = staticData.levels[record.level - 1].score;

    record.score = score;
    record.endTime = currentTime;

    await this.bossRaidRecordRepository.save(record);

    await this.bossRaidRepository
      .createQueryBuilder('boss_raid')
      .setLock('pessimistic_read')
      .update(BossRaid)
      .set({
        canEnter: true,
      })
      .where('userId = :userId', { userId })
      .execute();

    // 유효성 검사를 전부 통과 했으면
    // 1. 해당 레이드를 종료처리
    // 2. 레이드 level에 따른 score 반영
    return;
  }

  async getBossRaidStatus() {
    // 입장
    const bossRaid = await this.bossRaidRepository
      .createQueryBuilder('boss_raid')
      .orderBy('boss_raid.enteredAt', 'DESC')
      .getOne();

    // 보스레이드 기록이 없다면 시작 가능.
    if (!bossRaid) return { canEnter: true };

    const { canEnter, enteredAt, userId } = bossRaid;

    const {
      nextEnterTime, //다음 입장 가능 시간
      currentTime, // 지금 시간
    } = await this.getEnterTime(enteredAt);

    if (canEnter || currentTime > nextEnterTime) return { canEnter: true };

    return { canEnter: false, enteredUserId: userId };
  }
}
