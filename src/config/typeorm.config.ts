import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmAsyncModuleOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.MODE == 'dev', //! set 'false' in production
    // autoLoadEntities: true,
    // logging: process.env.MODE == 'dev',
  }),
};
