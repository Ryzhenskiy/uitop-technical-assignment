import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

function parseOrigins(csv?: string) {
  if (!csv) return [];
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  const port = Number(cfg.get('PORT') || 3000);
  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`App on http://localhost:${port}`);
  if (cfg.get('SWAGGER') === 'true')
    logger.log(`Swagger: http://localhost:${port}/api`);
}
bootstrap();
