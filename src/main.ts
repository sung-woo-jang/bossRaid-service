import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // HttpException Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // class-validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger
  SwaggerModule.setup(
    '/docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Boss Raid Service')
        .setDescription('보스레이드 API')
        .setVersion('1.0')
        .build(),
    ),
  );

  await app.listen(3000);
}
bootstrap();
