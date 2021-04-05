import { ProxyOrganizerModule } from '@hu-tao-supremacy:organizer/proxy-organizer.module';
import { ProxyParticipantModule } from '@hu-tao-supremacy:participant/proxy-participant.module';
import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';

@Module({
    imports: [ProxyOrganizerModule, ProxyParticipantModule],
    providers: [OrganizationResolver]
})
export class OrganizationModule { }
