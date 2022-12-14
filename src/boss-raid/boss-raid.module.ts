import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BossRaidService } from './boss-raid.service';
import { BossRaidController } from './boss-raid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BossRaidRecord } from './entities/boss-raid-record.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BossRaidRecord]), HttpModule, UserModule],
  controllers: [BossRaidController],
  providers: [BossRaidService],
})
export class BossRaidModule {}
