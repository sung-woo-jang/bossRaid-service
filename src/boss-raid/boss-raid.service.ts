import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BossRaid } from './entities/boss-raid.entity';

@Injectable()
export class BossRaidService {
  constructor(
    @InjectRepository(BossRaid)
    private readonly bossRaidRepository: Repository<BossRaid>,
  ) {}
}
