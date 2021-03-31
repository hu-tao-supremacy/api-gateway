import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { GlobalModule } from './global/global.module';
import { AccountModule } from './account/account.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { ProxyAccountModule } from './proxy-account/proxy-account.module';
import { ProxyFacilityModule } from './proxy-facility/proxy-facility.module';
import { ProxyOrganizerModule } from './proxy-organizer/proxy-organizer.module';
import { ProxyParticipantModule } from './proxy-participant/proxy-participant.module';
import { FileModule } from './file/file.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { OrganizationModule } from './organization/organization.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: process.env.NODE_ENV === 'dev',
      playground: true,
      uploads: false, // Disable built-in graphql-upload
    }),
    GlobalModule,
    AccountModule,
    EventModule,
    AuthModule,
    ProxyAccountModule,
    ProxyFacilityModule,
    ProxyOrganizerModule,
    ProxyParticipantModule,
    FileModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
    consumer.apply(AuthMiddleware)
  }
}
