import { ProxyOrganizerModule } from '@hu-tao-supremacy:organizer/proxy-organizer.module';
import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';

@Module({
    imports: [ProxyOrganizerModule],
    providers: [OrganizationResolver]
})
export class OrganizationModule { }
