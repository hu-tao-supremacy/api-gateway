import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { OrganizerModule } from './organizer/organizer.module';
import { ParticipantModule } from './participant/participant.module';
import { FacilityModule } from './facility/facility.module';
import { GraphQLModule } from '@nestjs/graphql';
import { EventModule } from './event/event.module';
import { GlobalModule } from './global/global.module';
import { EventModule } from './resolvers/event/event.module';
import { AccountModule } from './resolvers/account/account.module';
import { AccountModule } from './proxies/account/account.module';
import { ParticipantModule } from './proxies/participant/participant.module';
import { EventModule } from './proxies/event/event.module';
import { OrganizerModule } from './proxies/organizer/organizer.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: process.env.NODE_ENV === 'dev',
      playground: process.env.NODE_ENV === 'dev',
    }),
    AccountModule,
    OrganizerModule,
    ParticipantModule,
    FacilityModule,
    EventModule,
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
