import { Mime } from '../../mime/mime.entity';

export interface CreateInterface {
  active: boolean;
  width: number;
  height: number;
  size: number;
  link: string;
  hash: string;
  url: string;
  subFolder: string;
  header: string;
  altFull: string;
  altPreview: string;
  nameFull: string;
  namePreview: string;
  titleMeta: string;
  titleAttribute: string;
  descriptionPage: string;
  descriptionMeta: string;
  mime: Mime;
}
