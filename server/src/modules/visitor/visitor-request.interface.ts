import { Request } from 'express';
import { Visitor } from './visitor.entity';

export interface VisitorRequest extends Request {
  visitor: Visitor;
}
