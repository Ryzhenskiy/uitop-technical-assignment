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

async function createNestExpressApp() {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);

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
  // avoid clashing with Vercel’s /api folder by using /docs
  SwaggerModule.setup('docs', app, document);

  await app.init();
  return { app, expressApp, cfg };
}

let cachedServer: any;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const { expressApp } = await createNestExpressApp();
    cachedServer = expressApp;
  }
  return cachedServer(req, res);
}

async function bootstrapLocal() {
  const { app, cfg } = await createNestExpressApp();
  const port = Number(cfg.get('PORT') || 3000);
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`App on http://localhost:${port}`);
  logger.log(`Swagger: http://localhost:${port}/docs`);
}

if (process.env.VERCEL === 'false' || !process.env.VERCEL) {
  console.log('vercel?');
  bootstrapLocal();
}
