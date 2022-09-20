import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncModuleOptions } from 'src/config/typeorm.config';
import { UserModule } from './user/user.module';
import { BossRaidModule } from './boss-raid/boss-raid.module';
import * as redisStore from 'cache-manager-ioredis';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        MODE: Joi.string().valid('dev', 'prod').required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncModuleOptions),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 0,
    }),
    UserModule,
    BossRaidModule,
  ],
})
export class AppModule {}
