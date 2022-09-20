import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BossRaidRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  level: number;

  @Column({ default: 0 })
  score: number;

  @CreateDateColumn({ type: 'timestamp' })
  enterTime: Date;

  @Column({ type: 'timestamp', default: null })
  endTime: Date | null;

  @ManyToOne(() => User, (user) => user.bossRaid)
  @JoinColumn()
  user: User;
}
