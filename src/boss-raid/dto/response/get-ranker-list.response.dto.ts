import { ApiProperty } from '@nestjs/swagger';
import { RankingInfo } from 'src/boss-raid/boss-raid.service';

export class GetRankerListResponseDto {
  @ApiProperty({
    description: '전체 보스레이드 랭킹 리스트',
    example: [
      {
        ranking: 0,
        userId: 1,
        totalScore: 280,
      },
      {
        ranking: 1,
        userId: 2,
        totalScore: 20,
      },
    ],
  })
  topRankerInfoList: RankingInfo[];

  @ApiProperty({
    description: '조회한 유저의 랭킹 정보',
    example: {
      ranking: 1,
      userId: 2,
      totalScore: 20,
    },
  })
  myRankingInfo: RankingInfo;
}
