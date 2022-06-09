class Tag {
  id!: number;
  name!: string;
}

export class PictureDataTinyDto {
  id!: number;
  width!: number;
  height!: number;
  size!: number;
  link!: string;
  url!: string;
  header!: string;
  previewName!: string;
  previewAlt!: string;
  previewTitle!: string;
  previewWidth!: number;
  previewHeight!: number;
  mime!: string;
  views!: number;
  downloads!: number;
  created!: Date;
  tags!: Tag[];
}
