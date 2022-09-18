import { Module } from '@nestjs/common';
import { BossRaidService } from './boss-raid.service';
import { BossRaidController } from './boss-raid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BossRaidRecode } from './entities/boss-raid-recode.entity';
import { User } from 'src/user/entities/user.entity';
import { BossRaid } from './entities/boss-raid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BossRaidRecode, User, BossRaid])],
  controllers: [BossRaidController],
  providers: [BossRaidService],
})
export class BossRaidModule {}
