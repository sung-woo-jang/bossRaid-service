import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBossRaidResponseDto {
  @ApiProperty({ description: '보스레이드 입장 여부', example: true })
  isEntered: boolean;

  @ApiProperty({ description: '보스레이드 recordId', example: 1 })
  @ApiPropertyOptional()
  raidRecordId: number;
}
