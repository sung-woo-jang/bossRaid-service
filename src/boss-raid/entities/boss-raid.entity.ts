import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BossRaid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  canEnter: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  enteredAt: Date;

  @Column()
  userId: number;
}
