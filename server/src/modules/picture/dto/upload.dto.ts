import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UploadDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  active!: boolean;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  url!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  header!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  altFull!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  altPreview!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  nameFull!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  namePreview!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  titleMeta!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  titleAttribute!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  descriptionPage!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  descriptionMeta!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ArrayUnique()
  @Transform(({ value }) => value.map((v: string) => v.toLocaleLowerCase()))
  tags!: string[];
}
