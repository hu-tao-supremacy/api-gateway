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
import { merge, sampleSize, take } from 'lodash';
import { from, forkJoin, of, Observable } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from '@onepass/graphql/account/service';
import { FileService } from 'src/file/file.service';
import { encode } from 'js-base64';
import { nanoid } from 'nanoid';
import { catchGrpcException } from 'src/operators/catch-exceptions.operator';
import { GrpcException } from 'src/exceptions/grpc.exception';
import { flatten } from 'lodash';

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

  @Query(() => [Organization])
  featuredOrganizations(@Args('n', { type: () => Int }) n: number): Observable<Organization[]> {
    return this.organizerService.getOrganizations().pipe(map((organizations) => sampleSize(organizations, n)));
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
  async createOrganization(@CurrentUser() currentUser: User, @Args('input') input: CreateOrganizationInput) {
    const org = new Organization();
    merge(org, input);

    const createdOrg = await this.organizerService.createOrganization(currentUser.id, org).toPromise();
    const assigned = await this.accountService
      .assignRole(currentUser.id, createdOrg.id, Role.ORGANIZATION_OWNER)
      .toPromise();

    if (assigned) {
      const profilePicture = await this.fileService
        .upload(`orgs/${encode(`${createdOrg.id}`)}/${nanoid()}`, input.profilePicture)
        .toPromise();

      console.log(profilePicture);
      console.log(createdOrg);

      createdOrg.profilePictureUrl = profilePicture?.fileURI;
      createdOrg.profilePictureHash = profilePicture?.hash;

      const updatedOrg = await this.organizerService.updateOrganization(currentUser.id, createdOrg).toPromise();

      return updatedOrg;
    }

    return createdOrg;
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Organization)
  updateOrganization(@CurrentUser() currentUser: User, @Args('input') input: UpdateOrganizationInput) {
    return this.organizerService.getOrganizationById(input.id).pipe(
      catchGrpcException(),
      switchMap((org) =>
        this.organizerService.updateOrganization(currentUser.id, merge(org, input)).pipe(catchGrpcException()),
      ),
      switchMap((updatedOrg) => {
        return forkJoin([
          of(updatedOrg),
          this.fileService.upload(`orgs/${encode(`${updatedOrg.id}`)}/${nanoid()}`, input.profilePicture),
        ]);
      }),
      switchMap(([updatedOrg, profilePicture]) => {
        if (profilePicture) {
          updatedOrg.profilePictureUrl = profilePicture.fileURI;
          return this.organizerService.updateOrganization(currentUser.id, updatedOrg).pipe(catchGrpcException());
        }

        return of(updatedOrg);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Boolean)
  async addMembersToOrganization(
    @CurrentUser() currentUser: User,
    @Args('input') input: UpdateMembersInOrganizationInput,
  ) {
    return forkJoin(input.emails.map((email) => this.accountService.getUserByEmail(email))).pipe(
      catchGrpcException(),
      map((users) => users.map((user) => user.id)),
      switchMap((ids) => {
        return forkJoin([
          this.organizerService.addMembersToOrganization(currentUser.id, input.organizationId, ids),
          of(ids),
        ]);
      }),
      switchMap(([_, ids]) => {
        return forkJoin(
          ids.map((id) => this.accountService.assignRole(id, input.organizationId, Role.ORGANIZATION_EDITOR)),
        );
      }),
      map((_) => true),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => Boolean)
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

  @ResolveField()
  userOrganizations(@Parent() org: Organization) {
    return this.accountService.getUserOrganizationsByOrganizationId(org.id);
  }
}
