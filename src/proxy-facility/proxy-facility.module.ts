import { Module } from '@nestjs/common';
import { ProxyFacilityService } from './proxy-facility.service';

@Module({
  providers: [ProxyFacilityService]
})
export class ProxyFacilityModule {}
