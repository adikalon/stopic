class Tag {
  id!: number;
  name!: string;
}

export class PictureDataDto {
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
  subFolder!: string;
  tinyName!: string;
  tinyAlt!: string;
  tinyTitle!: string;
  tinyWidth!: number;
  tinyHeight!: number;
  smallName!: string;
  smallAlt!: string;
  smallTitle!: string;
  smallWidth!: number;
  smallHeight!: number;
  bigName!: string;
  bigAlt!: string;
  bigTitle!: string;
  bigWidth!: number;
  bigHeight!: number;
  mime!: string;
  createdDate!: Date;
  tags!: Tag[];
}
