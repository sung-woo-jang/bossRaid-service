import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BossRaid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  canEnter: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  enteredAt: Date;

  @Column()
  userId: number;
}
