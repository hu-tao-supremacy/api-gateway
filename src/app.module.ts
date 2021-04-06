import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { OrganizationModule } from './organization/organization.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UserModule } from './user/user.module';
import { ProxyModule } from './proxy/proxy.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: process.env.NODE_ENV === 'dev',
      playground: true,
      uploads: false, // Disable built-in graphql-upload
    }),
    EventModule,
    AuthModule,
    FileModule,
    OrganizationModule,
    UserModule,
    ProxyModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
    consumer.apply(AuthMiddleware).forRoutes('graphql');
  }
}
