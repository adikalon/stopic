import { UnsupportedMediaTypeException } from '@nestjs/common';
import { MimeTypeEnum } from '../mime/mime-type.enum';

export const uploadFilter = (_req: any, file: any, cb: any) => {
  if (Object.values(MimeTypeEnum).includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(new UnsupportedMediaTypeException('Unsupported mimetype'), false);
};
