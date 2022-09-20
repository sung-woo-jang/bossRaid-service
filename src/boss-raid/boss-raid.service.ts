import {
  BadRequestException,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CreateBossRaidDto } from './dto/create-boss-raid.dto';
import { UpdateBossRaidDto } from './dto/update-boss-raid.dto';
import { BossRaidRecord } from './entities/boss-raid-record.entity';
import { HttpService } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';
import { RankingListDto } from './dto/ranking-list.dto';

export interface Level {
  level: number;
  score: number;
}

export interface BossRaidStaticData {
  bossRaidLimitSeconds: number;
  levels: Level[];
}

export interface RankingInfo {
  ranking: number; // 랭킹 1위의 ranking 값은 0입니다.
  userId: number;
  totalScore: number;
}

//
export interface BossRaid {
  userId: number;
  canEnter: boolean;
  enteredAt: Date;
}

@Injectable()
export class BossRaidService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
    @InjectRepository(BossRaidRecord)
    private readonly bossRaidRecordRepository: Repository<BossRaidRecord>,
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

  /* 
  redis = {
    'entered_users': Queue(),
    'canEnter' : true
  }
  cache = redis

  function EnterAPI{
    const queue = cache.get('entered_users',lock=true)
    canEnter = queue.length == 0
    if(canEnter){
      queue.push(user.id)
      cache.set('entered_users', queue)
    }else{
      return false;
    }

    return true;
  }
  */

  async createBossRaid(createBossRaidDto: CreateBossRaidDto) {
    const { level, userId } = createBossRaidDto;

    // user 유효성 검사
    const user = await this.userService.findUserById(userId);

    // Todo: level 유효성 검사

    try {
      const bossRaidStatus = await this.cacheManager.get<BossRaid>('bossRaid');

      // - 아무도 보스레이드를 시작한 기록이 없다면 시작 가능
      const currentTime = new Date();
      if (!bossRaidStatus) {
        await this.cacheManager.set('bossRaid', {
          canEnter: false,
          userId,
          enteredAt: currentTime,
        });
      } else {
        const { canEnter, enteredAt } = bossRaidStatus;

        const {
          nextEnterTime, //다음 입장 가능 시간
          currentTime, // 지금 시간
        } = await this.getEnterTime(enteredAt);

        // 마지막 유저가 보스레이드를 종료했거나, 레이드 제한 시간을 초과했는지 판별
        if (!(canEnter || currentTime > nextEnterTime))
          return { isEntered: false };
      }

      // 레이드 기록 생성
      const raidRecord = await this.bossRaidRecordRepository
        .createQueryBuilder()
        .insert()
        .into(BossRaidRecord)
        .values({
          level,
          user,
          enterTime: currentTime,
        })
        .execute();

      return { raidRecord: raidRecord.raw[0].id, isEntered: true };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateRaidStatus(updateBossRaidDto: UpdateBossRaidDto) {
    const currentTime = new Date();

    // 레이드 종료 처리.
    // - 레이드 레벨에 따른 score 반영
    const { id: raidRecordId, userId } = updateBossRaidDto;

    let staticData: BossRaidStaticData;
    try {
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

    await this.cacheManager.set('bossRaid', { canEnter: true });

    // 유효성 검사를 전부 통과 했으면
    // 1. 해당 레이드를 종료처리
    // 2. 레이드 level에 따른 score 반영

    const topRankerInfoList = await this.calcRanking();

    await this.cacheManager.set('topRankerInfoList', topRankerInfoList);
  }

  async getTopRankerList(rankingListDto: RankingListDto) {
    const { userId } = rankingListDto;
    // user 유효성 검사
    await this.userService.findUserById(userId);

    let topRankerInfoList: RankingInfo[] = await this.cacheManager.get(
      'topRankerInfoList',
    );

    // 캐시된 데이터 없을 시 데이터 데이터 생성 및 캐싱
    if (!topRankerInfoList) {
      topRankerInfoList = await this.calcRanking();
      await this.cacheManager.set('topRankerInfoList', topRankerInfoList);
    }

    const myRankingInfo = topRankerInfoList.find((el) => el.userId === userId);

    return {
      topRankerInfoList,
      myRankingInfo,
    };
  }

  async getBossRaidStatus() {
    // 입장
    const bossRaid = await this.cacheManager.get<BossRaid>('bossRaid');

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

  private async calcRanking() {
    let result = await this.dataSource
      .getRepository(BossRaidRecord)
      .createQueryBuilder('boss_raid_record')
      .select('boss_raid_record.user_id')
      .addSelect('SUM(boss_raid_record.score)', 'totalScore')
      .addSelect(
        'ROW_NUMBER() OVER (ORDER BY SUM(boss_raid_record.score) DESC) -1 as "ranking"',
      )
      .groupBy('boss_raid_record.user_id')
      .getRawMany();

    result = result.map((el) => ({
      ranking: el.ranking * 1,
      userId: el.user_id,
      totalScore: el.totalScore * 1,
    }));

    return result;
  }

  async getEnterTime(lastEnterTime: Date) {
    const currentTime = new Date();
    lastEnterTime = new Date(lastEnterTime);

    const { bossRaidLimitSeconds } =
      await this.cacheManager.get<BossRaidStaticData>('bossRaidStaticData');

    const nextEnterTime = new Date(
      lastEnterTime.setSeconds(
        lastEnterTime.getSeconds() + bossRaidLimitSeconds,
      ),
    );

    return { nextEnterTime, currentTime };
  }
}
