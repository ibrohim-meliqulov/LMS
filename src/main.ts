import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  const config = new DocumentBuilder()
    .setTitle("LMS")
    .addBearerAuth()
    .build()
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("swagger", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
