import { Module } from '@nestjs/common';
import { EnvoyParticipantService } from './envoy-participant.service';

@Module({
  providers: [EnvoyParticipantService]
})
export class EnvoyParticipantModule {}
