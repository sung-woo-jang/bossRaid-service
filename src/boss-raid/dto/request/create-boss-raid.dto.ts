import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BossRaidRecord } from '../../entities/boss-raid-record.entity';

export class CreateBossRaidDto extends PickType(BossRaidRecord, [
  'level',
] as const) {
  @ApiProperty({ description: '보스레이드 참여 유저 id', minimum: 1 })
  @IsNumber()
  userId: number;
}
