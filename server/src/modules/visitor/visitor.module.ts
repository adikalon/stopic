import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorRepository } from './visitor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorRepository])],
})
export class VisitorModule {}
