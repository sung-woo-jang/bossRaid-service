import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncModuleOptions } from 'config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/../config/.config.env`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncModuleOptions),
  ],
})
export class AppModule {}
