import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadRepository } from './download.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DownloadRepository])],
})
export class DownloadModule {}
