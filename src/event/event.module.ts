import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { ProxyParticipantModule } from 'src/proxy-participant/proxy-participant.module';
import { ProxyParticipantService } from 'src/proxy-participant/proxy-participant.service';
import { ProxyOrganizerModule } from 'src/proxy-organizer/proxy-organizer.module';
import { ProxyOrganizerService } from 'src/proxy-organizer/proxy-organizer.service';

@Module({
  imports: [ProxyParticipantModule, ProxyOrganizerModule],
  providers: [
    ProxyParticipantService,
    ProxyOrganizerService,
    EventService,
    EventResolver,
  ],
})
export class EventModule {}
