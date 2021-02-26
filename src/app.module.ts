import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacilityModule } from './facility/facility.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GlobalModule } from './global/global.module';
import { EventModule } from './resolvers/event/event.module';
import { AccountModule } from './resolvers/account/account.module';
import { AccountModule as ProxyAccountModule } from './proxies/account/account.module';
import { ParticipantModule as ProxyParticipantModule } from './proxies/participant/participant.module';
import { EventModule as ProxyEventModule } from './proxies/event/event.module';
import { OrganizerModule as ProxyOrganizerModule } from './proxies/organizer/organizer.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: process.env.NODE_ENV === 'dev',
      playground: process.env.NODE_ENV === 'dev',
    }),

    GlobalModule,

    // Proxies
    ProxyAccountModule,
    ProxyParticipantModule,
    ProxyEventModule,
    ProxyOrganizerModule,

    // Resolvers
    EventModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
