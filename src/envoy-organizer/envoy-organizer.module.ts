import { Module } from '@nestjs/common';
import { EnvoyOrganizerService } from './envoy-organizer.service';

@Module({
  providers: [EnvoyOrganizerService],
  exports: [EnvoyOrganizerService],
})
export class EnvoyOrganizerModule {}
