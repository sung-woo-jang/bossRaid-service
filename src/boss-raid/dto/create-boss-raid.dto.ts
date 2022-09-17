import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BossRaid } from '../entities/boss-raid.entity';

export class CreateBossRaidDto extends PickType(BossRaid, ['level'] as const) {
  @IsNumber()
  userId: number;
}
