import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

function parseOrigins(csv?: string) {
  if (!csv) return [];
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createApp(expressApp = express()) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  const cfg = app.get(ConfigService);

  const origins = parseOrigins(cfg.get<string>('CORS_ORIGINS'));
  app.enableCors({
    origin: origins.length ? origins : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const docCfg = new DocumentBuilder()
    .setTitle('My Category-Todos API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, docCfg);
  SwaggerModule.setup('api', app, document);

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const cfg = app.get(ConfigService);
  const port = Number(cfg.get('PORT') || 3000);
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`App running on http://localhost:${port}`);
  if (cfg.get('SWAGGER') === 'true')
    logger.log(`Swagger: http://localhost:${port}/api`);
}

// Only auto-start locally
if (process.env.VERCEL !== '1') {
  bootstrap();
}
