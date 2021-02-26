import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { EnvoyParticipantModule } from 'src/envoy-participant/envoy-participant.module';
import { EnvoyParticipantService } from 'src/envoy-participant/envoy-participant.service';

@Module({
  imports: [EnvoyParticipantModule],
  providers: [EnvoyParticipantService, EventService, EventResolver],
})
export class EventModule {}
