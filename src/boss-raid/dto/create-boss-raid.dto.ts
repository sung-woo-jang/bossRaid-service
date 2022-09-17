import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BossRaidRecode } from '../entities/boss-raid.entity';

export class CreateBossRaidDto extends PickType(BossRaidRecode, [
  'level',
] as const) {
  @IsNumber()
  userId: number;
}
