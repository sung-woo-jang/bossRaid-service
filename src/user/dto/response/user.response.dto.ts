import { ApiProperty } from '@nestjs/swagger';
import { BossRaidHistory } from 'src/user/user.service';

export class FindUserResponseDto {
  @ApiProperty({ description: '유저의 보스레이드 총 점수' })
  totalScore: number;

  @ApiProperty({
    description: '유저의 보스레이드 참여 기록',
    example: [
      {
        raidRecordId: 28,
        score: 20,
        enterTime: '2022-09-20T15:16:31.153Z',
        endTime: '2022-09-20T15:16:38.259Z',
      },
    ],
  })
  bossRaidHistory: BossRaidHistory[];
}
