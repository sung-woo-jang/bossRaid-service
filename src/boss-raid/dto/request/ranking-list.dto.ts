import { IsNumber } from 'class-validator';

export class RankingListDto {
  @IsNumber()
  userId: number;
}
