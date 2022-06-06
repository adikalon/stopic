import { PartialType } from '@nestjs/swagger';
import { UploadDto } from './upload.dto';

export class EditDto extends PartialType(UploadDto) {}
