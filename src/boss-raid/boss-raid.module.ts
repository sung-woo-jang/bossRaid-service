import { Module } from '@nestjs/common';
import { BossRaidService } from './boss-raid.service';
import { BossRaidController } from './boss-raid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BossRaid } from './entities/boss-raid.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BossRaid, User])],
  controllers: [BossRaidController],
  providers: [BossRaidService],
})
export class BossRaidModule {}
