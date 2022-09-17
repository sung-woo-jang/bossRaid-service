import { Body, Controller, Post } from '@nestjs/common';
import { BossRaidService } from './boss-raid.service';
import { CreateBossRaidDto } from './dto/create-boss-raid.dto';

@Controller('bossRaid')
export class BossRaidController {
  constructor(private readonly bossRaidService: BossRaidService) {}

  @Post('enter')
  createBossRaid(@Body() createBossRaidDto: CreateBossRaidDto) {
    return this.bossRaidService.createBossRaid(createBossRaidDto);
  }
}
