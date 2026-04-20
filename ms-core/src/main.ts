import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { winstonLogger } from './common/logger/winston.config';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  // Note: CORS is handled by the Gateway, not needed here
  // Gateway adds CORS headers to all responses
  // app.enableCors({
  //   origin: ['http://localhost:5173', 'http://localhost:3001'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter with logging
  app.useGlobalFilters(new HttpExceptionFilter());

  // Note: No global prefix when behind Gateway
  // Gateway handles /api/v1 prefix and strips it before forwarding

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/quotes`);
}

bootstrap();
