import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { join } from 'path';

// Load root env if not already loaded
config({ path: join(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Block-Hash API')
    .setDescription('The multi-chain indexing and analytics API')
    .setVersion('1.0')
    .addTag('analytics')
    .addTag('wallets')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`[API Server] Running on http://localhost:${port}`);
  console.log(`[API Server] Docs on http://localhost:${port}/api/docs`);
}
bootstrap();
