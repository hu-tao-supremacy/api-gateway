import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AccountService } from '@onepass/account/account.service';
import { Organization, User, UserOrganization } from '@onepass/entities';
import { OrganizerService } from '@onepass/organizer/organizer.service';
import { ParticipantService } from '@onepass/participant/participant.service';

@Resolver((of) => UserOrganization)
export class UserOrganizationResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly participantService: ParticipantService,
    private readonly organizerService: OrganizerService,
  ) {}

  @ResolveField(() => Organization)
  organization(@Parent() userOrg: UserOrganization) {
    return this.organizerService.getOrganizationById(userOrg.organizationId);
  }

  @ResolveField(() => User)
  user(@Parent() userOrg: UserOrganization) {
    return this.accountService.getUserById(userOrg.userId);
  }
}
