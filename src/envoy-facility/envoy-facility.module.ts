import { Module } from '@nestjs/common';
import { EnvoyFacilityService } from './envoy-facility.service';

@Module({
  providers: [EnvoyFacilityService]
})
export class EnvoyFacilityModule {}
