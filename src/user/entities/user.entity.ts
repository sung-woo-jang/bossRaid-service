import { BossRaid } from 'src/boss-raid/entities/boss-raid.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @OneToMany(() => BossRaid, (bossRaid) => bossRaid.user)
  bossRaid: BossRaid;
}
