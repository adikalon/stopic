import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  url?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  link?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  token?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  header?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  content?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  subFolder?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  tinyName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  tinyAlt?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  tinyTitle?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  smallName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  smallAlt?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  smallTitle?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  bigName?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  bigAlt?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  bigTitle?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ArrayUnique()
  @Transform(({ value }) => value.map((v: string) => v.toLocaleLowerCase()))
  @IsOptional()
  tags?: string[];
}
