import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBossRaidDto } from './dto/create-boss-raid.dto';
import { BossRaid } from './entities/boss-raid.entity';

@Injectable()
export class BossRaidService {
  constructor(
    @InjectRepository(BossRaid)
    private readonly bossRaidRepository: Repository<BossRaid>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createBossRaid(createBossRaidDto: CreateBossRaidDto) {
    const { level, userId } = createBossRaidDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();

    const raidRecordId = await this.bossRaidRepository
      .createQueryBuilder('boss_raid')
      .insert()
      .values({ level, user })
      .execute();

    /*  Todo
        - isEntered 유효성 검사 후 응답값 변경
      */

    return { raidRecordId: raidRecordId.raw[0], isEntered: true };
  }
}
