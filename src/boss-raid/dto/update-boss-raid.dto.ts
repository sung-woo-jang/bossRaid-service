import { PartialType } from '@nestjs/swagger';
import { CreateBossRaidDto } from './create-boss-raid.dto';

export class UpdateBossRaidDto extends PartialType(CreateBossRaidDto) {}
