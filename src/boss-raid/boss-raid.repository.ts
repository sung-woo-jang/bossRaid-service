import { EntityRepository, Repository } from 'typeorm';
import { BossRaid } from './entities/boss-raid.entity';

@EntityRepository(BossRaid)
export class BossRaidRepository extends Repository<BossRaid> {}
