import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorRepository } from './visitor.repository';
import { VisitorService } from './visitor.service';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorRepository])],
  providers: [VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}
