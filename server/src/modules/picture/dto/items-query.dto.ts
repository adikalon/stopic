import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SortEnum } from '../sort.enum';

export class ItemsQueryDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => +value)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Min(1)
  @Max(3)
  @Transform(({ value }) => +value)
  @IsOptional()
  sort?: SortEnum;

  @IsString()
  @MinLength(3)
  @MaxLength(4)
  @Transform(({ value }) => (value === 'asc' ? 'asc' : 'desc'))
  @IsOptional()
  direction?: 'asc' | 'desc';

  @IsString()
  @MinLength(1)
  @IsOptional()
  search?: string;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  @IsOptional()
  fromWidth?: number;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  @IsOptional()
  fromHeight?: number;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  @IsOptional()
  toWidth?: number;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => +value)
  @IsOptional()
  toHeight?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ArrayUnique()
  @Transform(({ value }) => value.filter((v: string) => !isNaN(+v) && +v))
  @Transform(({ value }) => value.map((v: string) => +v))
  @IsOptional()
  tags?: number[];
}
