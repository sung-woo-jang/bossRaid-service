import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저 생성
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // 유저 정보 가져오기
  /* response {
  "totalScore": number,
	"bossRaidHistory": [
		{  "raidRecordId": number, "score": number, "enterTime": string, "endTime": string },
		// ..
}
*/
}
