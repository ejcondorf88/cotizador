import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('MS-Catalogos API')
    .setDescription('API de catálogos para el sistema SeguraX Cotizador')
    .setVersion('1.0')
    .addTag('giros', 'Gestión de giros de negocio')
    .addTag('agentes', 'Gestión de agentes de seguros')
    .addTag('suscriptores', 'Gestión de suscriptores')
    .addTag('oficinas', 'Gestión de oficinas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 MS-Catalogos running on: http://localhost:${port}`);
  console.log(`📚 Swagger Documentation: http://localhost:${port}/api-docs`);
}

bootstrap();
