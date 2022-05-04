import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MimeRepository } from './mime.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MimeRepository])],
})
export class MimeModule {}
