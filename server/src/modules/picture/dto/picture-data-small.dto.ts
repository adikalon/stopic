class Tag {
  id!: number;
  name!: string;
}

export class PictureDataSmallDto {
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
  created!: Date;
  views!: number;
  downloads!: number;
  tags!: Tag[];
}
