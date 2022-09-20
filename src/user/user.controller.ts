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

/* 
  모델
    유저
    보스레이드
    (랭킹 - redis)

  API
    유저
      Create
        - request
          - name
          - mobile
        - response
          - 생성된 userId를 응답
    
  redis = {
    'entered_users': Queue(),
    'canEnter' : true
  }
  cache = redis

  function EnterAPI{
    const queue = cache.get('entered_users',lock=true)
    canEnter = queue.length == 0
    if(canEnter){
      queue.push(user.id)
      cache.set('entered_users', queue)
    }else{
      return false;
    }

    return true;
  }
  */
