import { SortEnum } from '../sort.enum';

export interface ItemsInterface {
  offset: number;
  limit: number;
  sort: SortEnum;
  direction: 'asc' | 'desc';
  search: string | undefined;
  fromWidth: number | undefined;
  fromHeight: number | undefined;
  toWidth: number | undefined;
  toHeight: number | undefined;
  tags: number[] | undefined;
}
