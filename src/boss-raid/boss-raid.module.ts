import { Module } from '@nestjs/common';
import { BossRaidService } from './boss-raid.service';
import { BossRaidController } from './boss-raid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BossRaidRepository } from './boss-raid.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BossRaidRepository])],
  controllers: [BossRaidController],
  providers: [BossRaidService],
})
export class BossRaidModule {}
