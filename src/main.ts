import { NestFactory } from '@nestjs/core';
import { registerEnumType } from '@nestjs/graphql';
import { AppModule } from './app.module';
import * as common from './apis/hts/common/common';

async function bootstrap() {
  registerEnumType(common.Gender, { name: 'Gender' });
  registerEnumType(common.Status, { name: 'Status' });
  registerEnumType(common.DayOfWeek, { name: 'DayOfWeek' });
  registerEnumType(common.Permission, { name: 'Permission' });
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
