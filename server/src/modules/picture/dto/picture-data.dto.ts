export class PictureDataDto {
  id!: number;
  subFolder!: string;
  tinyName!: string;
  smallName!: string;
  bigName!: string;
  mime!: { id: number; type: string };
  tags!: { id: number; name: string }[];
}
