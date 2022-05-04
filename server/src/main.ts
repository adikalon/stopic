import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DefaultExceptionFilter } from './common/filters/default-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new DefaultExceptionFilter(httpAdapter));
  await app.listen(3000);
}
bootstrap();
