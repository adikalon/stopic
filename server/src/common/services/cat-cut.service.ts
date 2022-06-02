import { Injectable } from '@nestjs/common';

@Injectable()
export class CatCutService {
  async shorten(link: string, comment: string): Promise<string> {
    return link + comment;
  }
}
