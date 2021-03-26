import { NestFactory } from '@nestjs/core';
import { registerEnumType } from '@nestjs/graphql';
import { AppModule } from './app.module';
import { Gender, Status, DayOfWeek, Permission } from '@internal/common/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
}
bootstrap();
