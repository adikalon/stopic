import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { BannedGuard } from './common/guards/banned.guard';
import { ScheduleModule } from '@nestjs/schedule';
import TypeORMConfig from './ormconfig';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AppService } from './app.service';
import { IndexModule } from './modules/index/index.module';

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
    TypeOrmModule.forRoot(TypeORMConfig),

    /**
     * Schedule
     */
    ScheduleModule.forRoot(),

    /**
     * Custom modules
     */
    IndexModule,
    MimeModule,
    PictureModule,
    TagModule,
    VisitorModule,
    BannedModule,
    ViewModule,
    DownloadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BannedGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RegisterVisitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
