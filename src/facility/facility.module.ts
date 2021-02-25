import { Module } from '@nestjs/common';
import { FacilityResolver } from './facility.resolver';

@Module({
  providers: [FacilityResolver]
})
export class FacilityModule {}
