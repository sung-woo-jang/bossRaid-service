import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BossRaidRecord } from '../entities/boss-raid-record.entity';

export class UpdateBossRaidDto extends PickType(BossRaidRecord, [
  'id',
] as const) {
  @IsNumber()
  userId: number;
}
