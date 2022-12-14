import { plainToClass, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsString()
  @Transform(({ value }) => value.replace(/\/$/, ''))
  APP_URL!: string;

  @IsString()
  APP_NAME!: string;

  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsString()
  PG_USER!: string;

  @IsString()
  PG_PASSWORD!: string;

  @IsString()
  PG_BASENAME!: string;

  @IsString()
  ADMIN_TOKEN!: string;

  @IsString()
  YANDEX_DISK_KEY!: string;

  @IsString()
  @Transform(({ value }) => value.replace(/\/$/, ''))
  CATCUT_URL!: string;

  @IsNumber()
  CATCUT_APP_ID!: number;

  @IsString()
  CATCUT_APP_SECRET!: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
