import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { validate } from './env.validation';
import * as path from 'path';
import { MimeModule } from './modules/mime/mime.module';
import { PictureModule } from './modules/picture/picture.module';
import { TagModule } from './modules/tag/tag.module';
import { VisitorModule } from './modules/visitor/visitor.module';
import { BannedModule } from './modules/banned/banned.module';
import { ViewModule } from './modules/view/view.module';
import { DownloadModule } from './modules/download/download.module';
import { RegisterVisitorMiddleware } from './common/middlewares/register-visitor.middleware';
import { APP_GUARD } from '@nestjs/core';
import { BannedGuard } from './common/guards/banned.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { TrashModule } from './modules/trash/trash.module';
import { getConnectionOptions } from 'typeorm';

@Module({
  imports: [
    /**
     * Config
     */
    ConfigModule.forRoot({
      validate: validate,
      expandVariables: true,
      envFilePath: path.join(__dirname, '../../.env'),
      isGlobal: true,
    }),

    /**
     * TypeORM
     */
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),

    /**
     * Schedule
     */
    ScheduleModule.forRoot(),

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
    TrashModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BannedGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RegisterVisitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
