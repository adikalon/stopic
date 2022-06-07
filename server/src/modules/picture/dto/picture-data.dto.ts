export class PictureDataDto {
  id!: number;
  subFolder!: string;
  mime!: { id: number; type: string };
  tags!: { id: number; name: string }[];
}
