class Tag {
  id!: number;
  name!: string;
}

export class PictureDataBigDto {
  id!: number;
  width!: number;
  height!: number;
  size!: number;
  link!: string;
  title!: string;
  description!: string;
  header!: string;
  content!: string;
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
