import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: process.env.NODE_ENV === 'dev',
      playground: process.env.NODE_ENV === 'dev',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
