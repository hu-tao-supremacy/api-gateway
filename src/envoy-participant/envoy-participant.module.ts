import { Module } from '@nestjs/common';
import { EnvoyParticipantService } from './envoy-participant.service';

@Module({
  providers: [EnvoyParticipantService],
  exports: [EnvoyParticipantService],
})
export class EnvoyParticipantModule {}
