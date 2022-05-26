import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrashRepository } from './trash.repository';
import { TrashTypeRepository } from './trash-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TrashRepository, TrashTypeRepository])],
})
export class TrashModule {}
