import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Mime } from './mime/mime.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'app',
      password: 'app',
      database: 'app',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Mime]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
