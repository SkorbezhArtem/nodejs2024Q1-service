import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { parse } from 'yaml';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const DOC_PATH = join(cwd(), 'doc', 'api.yaml');

async function configureApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  return app;
}

async function loadSwaggerDocument(filePath: string) {
  const fileContent = await readFile(filePath, 'utf8');
  return parse(fileContent);
}

function setupSwagger(app, document) {
  SwaggerModule.setup('doc', app, document);
}

async function startServer(app, port) {
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

async function bootstrap() {
  const app = await configureApp();
  const swaggerDocument = await loadSwaggerDocument(DOC_PATH);
  setupSwagger(app, swaggerDocument);
  await startServer(app, PORT);
}

bootstrap();
