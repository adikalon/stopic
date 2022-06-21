import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { mw } from 'request-ip';
import { AppModule } from './app.module';
import { DefaultExceptionFilter } from './common/filters/default-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      validationError: {
        value: true,
      },
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new DefaultExceptionFilter(httpAdapter));

  app.use(mw());

  await app.listen(3000);
}
bootstrap();
