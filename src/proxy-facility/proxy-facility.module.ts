import { Global, Module } from '@nestjs/common';
import { ProxyFacilityService } from './proxy-facility.service';

@Global()
@Module({
  providers: [ProxyFacilityService]
})
export class ProxyFacilityModule { }
