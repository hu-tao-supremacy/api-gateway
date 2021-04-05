import { Event } from '@entities/event.entity';
import { Organization } from '@entities/organization.entity';
import { User } from '@entities/user.entity';
import { ProxyAccountService } from '@hu-tao-supremacy:account/proxy-account.service';
import { ProxyOrganizerService } from '@hu-tao-supremacy:organizer/proxy-organizer.service';
import { ProxyParticipantService } from '@hu-tao-supremacy:participant/proxy-participant.service';
import { CreateOrganizationInput, AddMembersToOrganizationInput } from '@inputs/organization.input';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { merge } from 'lodash';
import { from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Resolver((_) => Organization)
export class OrganizationResolver {
  constructor(
    private readonly proxyAccountService: ProxyAccountService,
    private readonly proxyOrganizerService: ProxyOrganizerService,
    private readonly proxyParticipantService: ProxyParticipantService,
  ) {}

  @Query((_) => [Organization])
  organizations() {
    return this.proxyOrganizerService.getOrganizations();
  }

  @Query((_) => Organization)
  organization(@Args('id', { type: () => Int }) id: number) {
    return this.proxyOrganizerService.getOrganizationById(id);
  }

  @ResolveField((_) => [Event])
  events(@Parent() org: Organization) {
    return this.proxyParticipantService.getEventsByOrganizationId(org.id);
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Boolean)
  createOrganization(@CurrentUser() currentUser: User, @Args('input') input: CreateOrganizationInput) {
    const org = new Organization();
    merge(org, input);
    return this.proxyOrganizerService.createOrganization(currentUser.id, org);
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Organization)
  addMembersToOrganization(@CurrentUser() currentUser: User, @Args('input') input: AddMembersToOrganizationInput) {
    return forkJoin(input.emails.map((email) => this.proxyAccountService.getUserByChulaId(email))).pipe(
      map((users) => users.map((user) => user.id)),
      switchMap((ids) =>
        this.proxyOrganizerService.addMembersToOrganization(currentUser.id, input.organizationId, ids),
      ),
    );
  }
}
