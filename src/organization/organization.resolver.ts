import { Event, Organization, User } from '@onepass/entities';
import { AccountService } from '@onepass/account/account.service';
import { OrganizerService } from '@onepass/organizer/organizer.service';
import { ParticipantService } from '@onepass/participant/participant.service';
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  UpdateMembersInOrganizationInput,
} from '@onepass/inputs/organization.input';
import { BadRequestException, HttpException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { merge } from 'lodash';
import { from, forkJoin, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from '@onepass/graphql/account/service';
import { FileService } from 'src/file/file.service';
import { encode } from 'js-base64';
import { nanoid } from 'nanoid';
import { catchGrpcException } from 'src/operators/catch-exceptions.operator';
import { GrpcException } from 'src/exceptions/grpc.exception';

@Resolver((_) => Organization)
export class OrganizationResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly organizerService: OrganizerService,
    private readonly participantService: ParticipantService,
    private readonly fileService: FileService,
  ) {}

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

  @ResolveField()
  profilePictureUrl(@Parent() org: Organization) {
    if (org.profilePictureUrl) {
      return this.fileService.getSignedUrl(org.profilePictureUrl);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Organization)
  createOrganization(@CurrentUser() currentUser: User, @Args('input') input: CreateOrganizationInput) {
    const org = new Organization();
    merge(org, input);
    return this.organizerService.createOrganization(currentUser.id, org).pipe(
      catchGrpcException(),
      switchMap((createdOrg) => {
        return forkJoin([
          this.accountService
            .assignRole(currentUser.id, createdOrg.id, Role.ORGANIZATION_OWNER)
            .pipe(catchGrpcException()),
          this.fileService.upload(`orgs/${encode(`${createdOrg.id}`)}/${nanoid()}`, input.profilePicture),
          of(createdOrg),
        ]);
      }),
      switchMap(([_, fileURI, createdOrg]) => {
        createdOrg.profilePictureUrl = fileURI;
        return this.organizerService.updateOrganization(currentUser.id, createdOrg).pipe(catchGrpcException());
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Organization)
  updateOrganization(@CurrentUser() currentUser: User, @Args('input') input: UpdateOrganizationInput) {
    const org = merge(new Organization(), input);
    return this.organizerService.updateOrganization(currentUser.id, org).pipe(
      switchMap((updatedOrg) => {
        return forkJoin([
          of(updatedOrg),
          this.fileService.upload(`orgs/${encode(`${updatedOrg.id}`)}/${nanoid()}`, input.profilePicture),
        ]);
      }),
      switchMap(([updatedOrg, profilePictureURI]) => {
        if (profilePictureURI) {
          updatedOrg.profilePictureUrl = profilePictureURI;
          return this.organizerService.updateOrganization(currentUser.id, updatedOrg);
        }

        return of(updatedOrg);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Organization)
  addMembersToOrganization(@CurrentUser() currentUser: User, @Args('input') input: UpdateMembersInOrganizationInput) {
    return forkJoin(input.emails.map((email) => this.accountService.getUserByEmail(email))).pipe(
      catchGrpcException(),
      map((users) => users.map((user) => user.id)),
      tap((ids) => this.organizerService.addMembersToOrganization(currentUser.id, input.organizationId, ids)),
      switchMap((ids) => {
        return forkJoin(
          ids.map((id) => this.accountService.assignRole(id, input.organizationId, Role.ORGANIZATION_MEMBER)),
        );
      }),
      map((_) => true),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Organization)
  removeMembersFromOrganization(
    @CurrentUser() currentUser: User,
    @Args('input') input: UpdateMembersInOrganizationInput,
  ) {
    return forkJoin(input.emails.map((email) => this.accountService.getUserByEmail(email))).pipe(
      catchGrpcException(),
      map((users) => users.map((user) => user.id)),
      switchMap((ids) =>
        this.organizerService.removeMembersFromOrganization(currentUser.id, input.organizationId, ids),
      ),
    );
  }
}
