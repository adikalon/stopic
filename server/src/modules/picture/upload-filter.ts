import { UnsupportedMediaTypeException } from '@nestjs/common';

const mimeTypes = ['image/jpeg', 'image/png'];

export const uploadFilter = (_req: any, file: any, cb: any) => {
  if (mimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(new UnsupportedMediaTypeException('Unsupported mimetype'), false);
};
