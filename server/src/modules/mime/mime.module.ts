import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MimeRepository } from './mime.repository';
import { MimeService } from './mime.service';

@Module({
  imports: [TypeOrmModule.forFeature([MimeRepository])],
  providers: [MimeService],
  exports: [MimeService, TypeOrmModule],
})
export class MimeModule {}
