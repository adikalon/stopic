import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannedRepository } from './banned.repository';
import { BannedService } from './banned.service';

@Module({
  imports: [TypeOrmModule.forFeature([BannedRepository])],
  providers: [BannedService],
  exports: [BannedService],
})
export class BannedModule {}
