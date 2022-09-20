/* import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BossRaid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '입장 가능 여부' })
  canEnter: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  enteredAt: Date;

  @Column()
  userId: number;
}
 */
