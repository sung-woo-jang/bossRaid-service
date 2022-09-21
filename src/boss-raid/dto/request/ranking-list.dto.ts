import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RankingListDto {
  @ApiProperty({ description: '랭킹 조회할 유저 id', example: 1 })
  @IsNumber()
  userId: number;
}
