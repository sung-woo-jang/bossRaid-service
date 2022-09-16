import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BossRaid extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  level: number;

  @Column({ default: 0 })
  score: number;

  @CreateDateColumn({ type: 'timestamp' })
  enterTime: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  endTime: Date;
}
