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

  @ManyToOne(() => User, (user) => user.bossRaid)
  @JoinColumn()
  user: User;
}
