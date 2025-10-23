import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express'
import { timeStamp } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()


  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));


  app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url, new Date().toLocaleString());
    next();
  });





  await app.listen(5000);
}
bootstrap();
