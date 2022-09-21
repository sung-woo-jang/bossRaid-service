import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BossRaid {
  @ApiProperty({
    example: 1,
    description: 'BossRaid Primary 컬럼',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: true,
    description: '보스레이드 입장가능 여부',
    required: true,
  })
  @Column({ comment: '입장 가능 여부' })
  canEnter: boolean;

  @ApiProperty({
    example: '2022-08-18T17:14:45.865Z',
    description: '보스레이드 입장 시간',
    required: true,
  })
  @CreateDateColumn({
    type: 'timestamp',
  })
  enteredAt: Date;

  @ApiProperty({ example: 1, description: '보스레이드에 입장한 유저의 id' })
  @Column()
  userId: number;
}
