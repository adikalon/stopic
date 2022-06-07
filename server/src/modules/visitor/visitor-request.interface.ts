import { Request } from 'express';
import { VisitorDto } from './visitor.dto';

export interface VisitorRequest extends Request {
  visitor: VisitorDto;
}
