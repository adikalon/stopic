import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannedRepository } from './banned.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BannedRepository])],
})
export class BannedModule {}
