import { ApiProperty } from '@nestjs/swagger';
import { BossRaidRecord } from 'src/boss-raid/entities/boss-raid-record.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'id - 자동생성',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'seastory624',
    description: '게임 계정입니다.',
    required: true,
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    example: 'Test123$',
    description: '계정 비밀번호 입니다.',
    required: true,
  })
  @Column()
  password: string;

  @ApiProperty({ type: () => BossRaidRecord })
  @OneToMany(() => BossRaidRecord, (bossRaid) => bossRaid.user)
  bossRaid: BossRaidRecord;
}
