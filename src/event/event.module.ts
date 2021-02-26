import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { EnvoyParticipantModule } from 'src/envoy-participant/envoy-participant.module';
import { EnvoyParticipantService } from 'src/envoy-participant/envoy-participant.service';
import { EnvoyOrganizerModule } from 'src/envoy-organizer/envoy-organizer.module';
import { EnvoyOrganizerService } from 'src/envoy-organizer/envoy-organizer.service';

@Module({
  imports: [EnvoyParticipantModule, EnvoyOrganizerModule],
  providers: [
    EnvoyParticipantService,
    EnvoyOrganizerService,
    EventService,
    EventResolver,
  ],
})
export class EventModule {}
