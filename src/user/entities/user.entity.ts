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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @OneToMany(() => BossRaidRecord, (bossRaid) => bossRaid.user)
  bossRaid: BossRaidRecord;
}
