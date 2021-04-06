import { Event, Organization, User } from '@onepass/entities'
import { AccountService } from '@onepass/account/account.service'
import { OrganizerService } from '@onepass/organizer/organizer.service'
import { ParticipantService } from '@onepass/participant/participant.service'
import { CreateOrganizationInput, AddMembersToOrganizationInput } from '@onepass/inputs/organization.input';
import { BadRequestException, HttpException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { merge } from 'lodash';
import { from, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Resolver((_) => Organization)
export class OrganizationResolver {
    constructor(
        private readonly accountService: AccountService,
        private readonly organizerService: OrganizerService,
        private readonly participantService: ParticipantService,
    ) { }

    @Query((_) => [Organization])
    organizations() {
        return this.organizerService.getOrganizations();
    }

    @Query((_) => Organization)
    organization(@Args('id', { type: () => Int }) id: number) {
        return this.organizerService.getOrganizationById(id);
    }

    @ResolveField((_) => [Event])
    events(@Parent() org: Organization) {
        return this.participantService.getEventsByOrganizationId(org.id);
    }

    @UseGuards(AuthGuard)
    @Mutation((_) => Boolean)
    createOrganization(@CurrentUser() currentUser: User, @Args('input') input: CreateOrganizationInput) {
        const org = new Organization();
        merge(org, input);
        return this.organizerService.createOrganization(currentUser.id, org);
    }

    @UseGuards(AuthGuard)
    @Mutation((_) => Organization)
    addMembersToOrganization(@CurrentUser() currentUser: User, @Args('input') input: AddMembersToOrganizationInput) {
        return forkJoin(input.emails.map((email) => this.accountService.getUserByEmail(email))).pipe(
            catchError((error: HttpException) => {
                console.log(error.getStatus(), error)
                throw new BadRequestException();
            }),
            map((users) => users.map((user) => user.id)),
            switchMap((ids) =>
                this.organizerService.addMembersToOrganization(currentUser.id, input.organizationId, ids),
            ),
        );
    }
}
