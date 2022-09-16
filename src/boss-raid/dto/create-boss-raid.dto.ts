import { PickType } from '@nestjs/swagger';
import { BossRaid } from '../entities/boss-raid.entity';

export class CreateBossRaidDto extends PickType(BossRaid, [] as const) {}
