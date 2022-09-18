import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BossRaidRecode } from '../entities/boss-raid-recode.entity';

export class UpdateBossRaidDto extends PickType(BossRaidRecode, [
  'id',
] as const) {
  @IsNumber()
  userId: number;
}
