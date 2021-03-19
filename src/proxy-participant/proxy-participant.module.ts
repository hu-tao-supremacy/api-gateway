import { Module } from '@nestjs/common';
import { ProxyParticipantService } from './proxy-participant.service';

@Module({
  providers: [ProxyParticipantService]
})
export class ProxyParticipantModule {}
