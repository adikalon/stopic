import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const configService = new ConfigService<EnvironmentVariables, true>();

export default {
  type: 'postgres',
  port: 5432,
  host: 'postgres',
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_BASENAME'),
  synchronize: false,
  migrationsRun: true,
  autoLoadEntities: true,
  migrations: [`${__dirname}/database/migrations/**/*.js`],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
} as TypeOrmModuleOptions;
