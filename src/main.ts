import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  appSetup(app);
  const PORT = process.env.PORT || 5001;
  await app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}
bootstrap();
