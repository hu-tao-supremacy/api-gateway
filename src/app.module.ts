import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { GlobalModule } from './global/global.module';
import { EnvoyAccountModule } from './envoy-account/envoy-account.module';
import { EnvoyOrganizerModule } from './envoy-organizer/envoy-organizer.module';
import { EnvoyParticipantModule } from './envoy-participant/envoy-participant.module';
import { EnvoyFacilityModule } from './envoy-facility/envoy-facility.module';
import { AccountModule } from './account/account.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: process.env.NODE_ENV === 'dev',
      playground: process.env.NODE_ENV === 'dev',
    }),
    GlobalModule,
    EnvoyAccountModule,
    EnvoyOrganizerModule,
    EnvoyParticipantModule,
    EnvoyFacilityModule,
    AccountModule,
    EventModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
