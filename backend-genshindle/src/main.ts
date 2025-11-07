import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilitar CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // se seu Next rodar nessa porta
      'http://localhost:3001', // se você rodar Next em 3001
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(8000); // escolha uma porta diferente do Next
}
bootstrap();
