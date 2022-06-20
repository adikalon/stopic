import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorController } from './visitor.controller';
import { VisitorRepository } from './visitor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorRepository])],
  exports: [TypeOrmModule],
  controllers: [VisitorController],
})
export class VisitorModule {}
