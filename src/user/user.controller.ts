import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('User API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 유저 생성
  @ApiOperation({
    summary: '유저 생성 API',
    description: '유저를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '유저를 생성합니다.',
  })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({
    summary: '유저 조회 API',
    description: '유저를 조회합니다.',
  })
  @ApiOkResponse({
    description: '유저를 조회합니다.',
  })
  @Get(':id')
  findUserWithRaidRecordById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserWithRaidRecordById(id);
  }
}
