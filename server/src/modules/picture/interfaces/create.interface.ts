import { Mime } from '../../mime/mime.entity';

export interface CreateInterface {
  active: boolean;
  width: number;
  height: number;
  size: number;
  link: string;
  token: string;
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
  widthPreviewTiny: number;
  heightPreviewTiny: number;
  widthPreviewSmall: number;
  heightPreviewSmall: number;
  widthPreviewBig: number;
  heightPreviewBig: number;
  mime: Mime;
}
