import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { validate, EnvironmentVariables } from './env.validation';
import * as path from 'path';
import { MimeModule } from './modules/mime/mime.module';
import { PictureModule } from './modules/picture/picture.module';
import { TagModule } from './modules/tag/tag.module';

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
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        type: 'postgres',
        port: 5432,
        host: 'postgres',
        username: configService.get('PG_USER'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_BASENAME'),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    /**
     * Custom modules
     */
    MimeModule,
    PictureModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
