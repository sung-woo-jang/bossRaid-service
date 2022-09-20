import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { BossRaidService } from './boss-raid.service';
import { CreateBossRaidDto } from './dto/create-boss-raid.dto';
import { RankingListDto } from './dto/ranking-list.dto';
import { UpdateBossRaidDto } from './dto/update-boss-raid.dto';

@Controller('bossRaid')
export class BossRaidController {
  constructor(private readonly bossRaidService: BossRaidService) {}

  // 보스레이드 현재 상태 응답
  @Get()
  getBossRaidStatus() {
    return this.bossRaidService.getBossRaidStatus();
  }

  @Post('enter')
  createBossRaid(@Body() createBossRaidDto: CreateBossRaidDto) {
    return this.bossRaidService.createBossRaid(createBossRaidDto);
  }

  @Patch('end')
  updateRaidStatus(@Body() updateBossRaidDto: UpdateBossRaidDto) {
    return this.bossRaidService.updateRaidStatus(updateBossRaidDto);
  }

  @Get('topRankerList')
  getTopRankerList(@Body() rankingListDto: RankingListDto) {
    return this.bossRaidService.getTopRankerList(rankingListDto);
  }
}
