import { Global, Module } from '@nestjs/common';
import { ProxyOrganizerService } from './proxy-organizer.service';

@Global()
@Module({
  providers: [ProxyOrganizerService],
  exports: [ProxyOrganizerService],
})
export class ProxyOrganizerModule { }
