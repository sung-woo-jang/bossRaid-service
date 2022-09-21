import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BossRaidStatusResponseDto {
  @ApiProperty({ description: '보스레이드 입장 가능 여부', example: false })
  canEnter: boolean;

  @ApiProperty({
    description: '보스레이드 진행중인 유저의 id',
    example: 1,
  })
  @ApiPropertyOptional()
  enteredUserId: number;
}
