import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           
      forbidNonWhitelisted: true,   
      transform: true,             
    }),
  );

  await app.listen(3000, '0.0.0.0');
  console.log('Servidor backend corriendo en puerto 3000');
}
void bootstrap();
