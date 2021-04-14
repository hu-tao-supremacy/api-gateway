import { Module } from '@nestjs/common';
import { UserOrganizationResolver } from './user-organization.resolver';

@Module({
  providers: [UserOrganizationResolver],
})
export class UserOrganizationModule {}
