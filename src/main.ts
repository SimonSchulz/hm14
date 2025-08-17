import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './app.setup';
import { DomainHttpExceptionsFilter } from './core/exeptions/filters/domain-exceptions.filter';
import { AllHttpExceptionsFilter } from './core/exeptions/filters/all-exceptions.filter';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.enableCors();
  appSetup(app);
  app.useGlobalFilters(
    new DomainHttpExceptionsFilter(),
    new AllHttpExceptionsFilter(),
  );
  const PORT = process.env.PORT || 5001;
  await app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}
bootstrap();
