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
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  url!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  description!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  header!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  content!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  tinyName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  tinyAlt!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  tinyTitle!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  smallName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  smallAlt!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  smallTitle!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  bigName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  bigAlt!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  bigTitle!: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  active!: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ArrayUnique()
  @Transform(({ value }) => value.map((v: string) => v.toLocaleLowerCase()))
  tags!: string[];
}
