import { Event } from '@entities/event.entity';
import { Organization } from '@entities/organization.entity';
import { ProxyOrganizerService } from '@hu-tao-supremacy:organizer/proxy-organizer.service';
import { ProxyParticipantService } from '@hu-tao-supremacy:participant/proxy-participant.service';
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver((_) => Organization)
export class OrganizationResolver {
    constructor(
        private readonly proxyOrganizerService: ProxyOrganizerService,
        private readonly proxyParticipantService: ProxyParticipantService
    ) { }

    @Query((_) => [Organization])
    organizations() {
        return this.proxyOrganizerService.getOrganizations()
    }

    @Query((_) => Organization)
    organization(@Args('id', { type: () => Int }) id: number) {
        return this.proxyOrganizerService.getOrganizationById(id);
    }

    @ResolveField((_) => [Event])
    events(@Parent() org: Organization) {
        return this.proxyParticipantService.getEventsByOrganizationId(org.id);
    }
}
