import { Injectable } from '@nestjs/common';

@Injectable()
export class MimeService {
  async getExtByMime(mime: string): Promise<string> {
    return mime.replace(/^.+\//, '');
  }
}
