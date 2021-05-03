import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLBaseExceptionFilter } from './exception-filters/graphql.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GraphQLBaseExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
