import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { validate, EnvironmentVariables } from './env.validation';
import * as path from 'path';
import { MimeModule } from './modules/mime/mime.module';
import { PictureModule } from './modules/picture/picture.module';
import { TagModule } from './modules/tag/tag.module';
import { VisitorModule } from './modules/visitor/visitor.module';
import { BannedModule } from './modules/banned/banned.module';
import { ViewModule } from './modules/view/view.module';
import { DownloadModule } from './modules/download/download.module';
import { RegisterVisitorMiddleware } from './common/middlewares/register-visitor.middleware';
import { CheckHeadersMiddleware } from './common/middlewares/check-headers.middleware';

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
    VisitorModule,
    BannedModule,
    ViewModule,
    DownloadModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckHeadersMiddleware, RegisterVisitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
