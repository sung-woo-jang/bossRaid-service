import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncModuleOptions } from 'src/config/typeorm.config';
import { UserModule } from './user/user.module';
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
    UserModule,
  ],
})
export class AppModule {}
