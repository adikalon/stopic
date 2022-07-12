import { PictureInterface } from './picture.interface';

export interface PicturesGetInterface {
  total: number;
  limit: number;
  data: PictureInterface[];
}
