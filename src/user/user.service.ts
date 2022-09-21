import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/create-user.dto';
import { User } from './entities/user.entity';

export interface BossRaidHistory {
  raidRecordId: number;
  score: number;
  enterTime: string;
  endTime: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserWithRaidRecordById(id: number) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.bossRaid', 'record')
      .where('user.id = :id', { id });

    const result = await query.execute();

    if (!result)
      throw new NotFoundException('사용자 정보를 정확히 입력해주세요.');

    const sumScore = await query
      .select('SUM(record.score)', 'totalScore')
      .where('user.id = :id', { id })
      .execute();

    const bossRaidHistory: BossRaidHistory[] = [];
    const totalScore = Number(sumScore[0].totalScore);

    result.forEach((el) =>
      bossRaidHistory.push({
        raidRecordId: el.record_id,
        score: el.record_score,
        enterTime: el.record_enter_time,
        endTime: el.record_end_time,
      }),
    );

    return { totalScore, bossRaidHistory };
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .insert()
      .values({ ...createUserDto })
      .execute();

    return { userId: user.raw[0].id };
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();
    if (!user) throw new NotFoundException(`${userId} is not found.`);

    return user;
  }
}
