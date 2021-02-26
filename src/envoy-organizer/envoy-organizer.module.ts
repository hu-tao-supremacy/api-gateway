import { Module } from '@nestjs/common';
import { EnvoyOrganizerService } from './envoy-organizer.service';

@Module({
  providers: [EnvoyOrganizerService]
})
export class EnvoyOrganizerModule {}
