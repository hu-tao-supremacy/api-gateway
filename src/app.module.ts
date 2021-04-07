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
import { QuestionGroupModule } from './question-group/question-group.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      fieldResolverEnhancers: ['interceptors', 'guards'],
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
    QuestionGroupModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress({
      maxFileSize: 5 * 1000 * 1000
    })).forRoutes('graphql');
    consumer.apply(AuthMiddleware).forRoutes('graphql');
  }
}
