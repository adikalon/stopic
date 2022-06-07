class Mime {
  id!: number;
  type!: string;
}

class Tag {
  id!: number;
  name!: string;
}

export class PictureDataDto {
  id!: number;
  subFolder!: string;
  tinyName!: string;
  smallName!: string;
  bigName!: string;
  mime!: Mime;
  tags!: Tag[];
}
