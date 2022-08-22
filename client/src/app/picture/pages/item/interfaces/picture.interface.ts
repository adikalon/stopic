class Tag {
  id!: number;
  name!: string;
}

export class PictureInterface {
  id!: number;
  width!: number;
  height!: number;
  size!: number;
  link!: string;
  url!: string;
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
