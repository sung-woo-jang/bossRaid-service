import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({ description: '생성된 User id', example: 2 })
  userId: number;
}
