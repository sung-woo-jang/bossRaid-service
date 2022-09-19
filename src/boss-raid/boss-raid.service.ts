import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBossRaidDto } from './dto/create-boss-raid.dto';
import { UpdateBossRaidDto } from './dto/update-boss-raid.dto';
import { BossRaidRecode } from './entities/boss-raid-recode.entity';
import { BossRaid } from './entities/boss-raid.entity';

@Injectable()
export class BossRaidService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BossRaidRecode)
    private readonly bossRaidRecodeRepository: Repository<BossRaidRecode>,
    @InjectRepository(BossRaid)
    private readonly bossRaidRepository: Repository<BossRaid>,
    private dataSource: DataSource,
  ) {}

  async createBossRaid(createBossRaidDto: CreateBossRaidDto) {
    const { level, userId } = createBossRaidDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) throw new NotFoundException(`${userId} is not found.`);

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
      } = this.getTimeInfo(enteredAt);

      // 마지막 유저가 보스레이드를 종료했거나, 레이드 제한 시간을 초과했는지 판별
      if (!(canEnter || currentTime > nextEnterTime))
        return { isEntered: false };
    }
    const currentTime = new Date();

    await this.dataSource
      .createQueryBuilder()
      .update(BossRaid)
      .set({
        canEnter: false,
        userId,
        enteredAt: new Date(currentTime),
      })
      .where('id = :id', { id: bossRaid.id })
      .execute();

    // 레이드 기록 생성
    const raidRecord = await this.bossRaidRecodeRepository
      .createQueryBuilder()
      .insert()
      .into(BossRaidRecode)
      .values({
        level,
        user,
        enterTime: new Date(currentTime),
      })
      .execute();

    return { raidRecord: raidRecord.raw[0].id, isEntered: true };
  }

  getTimeInfo(lastEnterTime: Date) {
    // TODO : 3을 변수로 바꾸기
    const currentTime = new Date();

    const nextEnterTime = new Date(
      lastEnterTime.setMinutes(lastEnterTime.getMinutes() + 3),
    );

    return { nextEnterTime, currentTime };
  }

  async updateRaidStatus(updateBossRaidDto: UpdateBossRaidDto) {
    // 레이드 종료 처리.
    // - 레이드 레벨에 따른 score 반영

    // 유효성 검사
    // - 저장된 userId와 raidRecordId가 일치하지 않는다면 예외 처리
    // - 시작한 시간으로부터 레이드 제한시간이 지났다면 예외처리
    return '';
  }

  async getBossRaidStatus() {
    // 입장

    // BossRaid DB에서 가장 최신 정보를 꺼냄
    // 1. 보스레이드를 시작한 기록이 없으면 시작 가능 return
    /* 2. 보스레이드 기록이 있는 경우
        - 입장 가능 여부 확인
     */

    // return {canEnter: 입장 가능 여부, enterdUserId: 입장한 유저가 있으면 해당 userId}
    return '';
  }
}
