import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('Movie API for awards control')
    .setVersion('1.0')
    .addTag('movie')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8000);
  console.log(`The server is listen in port:${process.env.PORT ?? 8000}`);
}
bootstrap();
