import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';

@Module({
  providers: [OrganizationResolver],
})
export class OrganizationModule {}
