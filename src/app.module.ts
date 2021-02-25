import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { OrganizerModule } from './organizer/organizer.module';
import { ParticipantModule } from './participant/participant.module';
import { FacilityModule } from './facility/facility.module';
import { GraphQLModule } from '@nestjs/graphql';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
