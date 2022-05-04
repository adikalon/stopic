import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Mime } from './mime/mime.entity';
import { validate } from './env.validation';
import * as path from 'path';

@Module({
  imports: [
    /**
     * Config
     */
    ConfigModule.forRoot({
      validate: validate,
      expandVariables: true,
      envFilePath: path.join(__dirname, '../../.env'),
    }),

    /**
     * TypeORM
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: 5432,
        host: 'postgres',
        username: configService.get<string>('PG_USER', ''),
        password: configService.get<string>('PG_PASSWORD', ''),
        database: configService.get<string>('PG_BASENAME', ''),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([Mime]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
