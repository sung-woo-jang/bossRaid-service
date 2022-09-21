import { ApiProperty } from '@nestjs/swagger';
import { BossRaidHistory } from 'src/user/user.service';

export class FindUserResponseDto {
  @ApiProperty({ description: '유저의 보스레이드 총 점수' })
  totalScore: number;

  @ApiProperty({ description: '유저의 보스레이드 참여 기록' })
  bossRaidHistory: BossRaidHistory[];
}
