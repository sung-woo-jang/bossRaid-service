import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBossRaidDto } from './dto/create-boss-raid.dto';
import { UpdateBossRaidDto } from './dto/update-boss-raid.dto';
import { BossRaidRecode } from './entities/boss-raid.entity';

@Injectable()
export class BossRaidService {
  constructor(
    @InjectRepository(BossRaidRecode)
    private readonly bossRaidRecodeRepository: Repository<BossRaidRecode>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createBossRaid(createBossRaidDto: CreateBossRaidDto) {
    const { level, userId } = createBossRaidDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    const raidRecordId = await this.bossRaidRecodeRepository
      .createQueryBuilder('boss_raid')
      .insert()
      .values({ level, user })
      .execute();

    /*  Todo
        - isEntered 유효성 검사 후 응답값 변경
      */

    return { raidRecordId: raidRecordId.raw[0], isEntered: true };
  }

  async updateRaidStatus(updateBossRaidDto: UpdateBossRaidDto) {
    // 레이드 종료 처리.
    // - 레이드 레벨에 따른 score 반영

    // 유효성 검사
    // - 저장된 userId와 raidRecordId가 일치하지 않는다면 예외 처리
    // - 시작한 시간으로부터 레이드 제한시간이 지났다면 예외처리
    return '';
  }

  async getRaidStatus() {
    // 입장

    // return {canEnter: 입장 가능 여부, enterdUserId: 입장한 유저가 있으면 해당 userId}
    return '';
  }
}
