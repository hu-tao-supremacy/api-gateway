import { Global, Module } from '@nestjs/common';
import { ProxyParticipantService } from './proxy-participant.service';

@Global()
@Module({
  providers: [ProxyParticipantService],
  exports: [ProxyParticipantService],
})
export class ProxyParticipantModule { }
