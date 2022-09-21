import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BossRaidRecord extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: '보스레이드 활동 기록 Primary 컬럼',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'BossRaid의 입장 level',
    required: true,
  })
  @Column()
  level: number;

  @ApiProperty({
    example: 20,
    description: 'BossRaid 클리어 점수',
    required: true,
  })
  @Column({ default: 0 })
  score: number;

  @ApiProperty({
    example: '2022-08-18T17:14:45.865Z',
    description: 'BossRaid 입장 시간',
    required: true,
  })
  @CreateDateColumn({ type: 'timestamp' })
  enterTime: Date;

  @ApiProperty({
    example: '2022-08-18T17:14:45.865Z',
    description: 'BossRaid Primary 컬럼',
    required: true,
  })
  @Column({ type: 'timestamp', default: null })
  endTime: Date | null;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.bossRaid)
  @JoinColumn()
  user: User;
}
