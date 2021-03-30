import { Organization } from '@entities/organization.entity';
import { ProxyOrganizerService } from '@hu-tao-supremacy:organizer/proxy-organizer.service';
import { ProxyParticipantService } from '@hu-tao-supremacy:participant/proxy-participant.service';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver((_) => Organization)
export class OrganizationResolver {
    constructor(
        private readonly proxyOrganizerService: ProxyOrganizerService,
        private readonly proxyParticipantService: ProxyParticipantService
    ) { }

    @Query((_) => [Organization])
    organizations() {
        return []
    }

    @Query((_) => Organization)
    organization(@Args('id', { type: () => Int }) id: number) {
        return null;
    }
}
