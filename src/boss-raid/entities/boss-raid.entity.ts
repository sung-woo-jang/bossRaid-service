import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BossRaid extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
