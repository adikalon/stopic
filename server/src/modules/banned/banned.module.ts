import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannedRepository } from './banned.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BannedRepository])],
  exports: [TypeOrmModule],
})
export class BannedModule {}
