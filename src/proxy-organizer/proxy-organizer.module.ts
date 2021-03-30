import { Module } from '@nestjs/common';
import { ProxyOrganizerService } from './proxy-organizer.service';

@Module({
  providers: [ProxyOrganizerService],
  exports: [ProxyOrganizerService],
})
export class ProxyOrganizerModule {}
