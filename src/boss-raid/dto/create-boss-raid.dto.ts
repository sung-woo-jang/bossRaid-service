import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BossRaidRecord } from '../entities/boss-raid-record.entity';

export class CreateBossRaidDto extends PickType(BossRaidRecord, [
  'level',
] as const) {
  @IsNumber()
  userId: number;
}
