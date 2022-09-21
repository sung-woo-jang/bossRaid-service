import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BossRaidService } from './boss-raid.service';
import { CreateBossRaidDto } from './dto/create-boss-raid.dto';
import { RankingListDto } from './dto/ranking-list.dto';
import { UpdateBossRaidDto } from './dto/update-boss-raid.dto';

@ApiTags('BossRaid API')
@Controller('bossRaid')
export class BossRaidController {
  constructor(private readonly bossRaidService: BossRaidService) {}

  // 보스레이드 현재 상태 응답
  @ApiOperation({
    summary: '보스레이드 상태 조회 API',
    description:
      '보스레이드 현재 상태를 응답합니다. (입장 가능 여부, 현재 진행중인 유저가 있다면, 해당 유저의 id)',
  })
  @ApiOkResponse({
    description:
      '보스레이드 현재 상태를 응답합니다. (입장 가능 여부, 현재 진행중인 유저가 있다면, 해당 유저의 id)',
  })
  @Get()
  getBossRaidStatus() {
    return this.bossRaidService.getBossRaidStatus();
  }

  @ApiOperation({
    summary: '보스레이드 시작 API',
    description: '보스레이드 입장이 가능하다면 보스레이드를 시작합니다.',
  })
  @ApiCreatedResponse({
    description: '보스레이드 입장이 가능하다면 보스레이드를 시작합니다.',
  })
  @Post('enter')
  createBossRaid(@Body() createBossRaidDto: CreateBossRaidDto) {
    return this.bossRaidService.createBossRaid(createBossRaidDto);
  }

  @ApiOperation({
    summary: '보스레이드 종료 API',
    description: '보스레이드를 종료합니다.',
  })
  @ApiOkResponse({
    description: '보스레이드를 종료합니다.',
  })
  @Patch('end')
  updateRaidStatus(@Body() updateBossRaidDto: UpdateBossRaidDto) {
    return this.bossRaidService.updateRaidStatus(updateBossRaidDto);
  }

  @ApiOperation({
    summary: '보스레이드 랭킹 조회 API',
    description: '보스레이드 totalScore 내림차순으로 랭킹을 조회합니다.',
  })
  @ApiOkResponse({
    description: '보스레이드 totalScore 내림차순으로 랭킹을 조회합니다.',
  })
  @Get('topRankerList')
  getTopRankerList(@Body() rankingListDto: RankingListDto) {
    return this.bossRaidService.getTopRankerList(rankingListDto);
  }
}
