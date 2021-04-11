import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import {
  OrganizerServiceClient,
  HTS_ORGANIZER_PACKAGE_NAME,
  ORGANIZER_SERVICE_NAME,
  UpdateUsersInOrganizationRequest,
  UpdateTagRequest,
  CreateEventRequest,
} from '@onepass/api/organizer/service';
import { ClientGrpc } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization, QuestionGroup, Event } from '@onepass/entities';
import { EventAdapter, OrganizationAdapter } from '@onepass/adapters';

@Injectable()
export class OrganizerService implements OnModuleInit {
  private organizerService: OrganizerServiceClient;

  constructor(@Inject(HTS_ORGANIZER_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.organizerService = this.client.getService<OrganizerServiceClient>(ORGANIZER_SERVICE_NAME);
  }

  getOrganizationById(organizationId: number): Observable<Organization> {
    return this.organizerService
      .getOrganizationById({
        id: organizationId,
      })
      .pipe(map((org) => new OrganizationAdapter().toEntity(org)));
  }

  getOrganizations(): Observable<Organization[]> {
    return this.organizerService.getOrganizations({}).pipe(
      map((project) => project.organizations),
      map((orgs) => orgs.map((org) => new OrganizationAdapter().toEntity(org))),
    );
  }

  createOrganization(userId: number, organization: Organization): Observable<Organization> {
    return this.organizerService
      .createOrganization({ userId, organization: new OrganizationAdapter().toInterchangeFormat(organization) })
      .pipe(map((org) => new OrganizationAdapter().toEntity(org)));
  }

  addMembersToOrganization(currentUserId: number, organizationId: number, userIds: number[]): Observable<boolean> {
    const request: UpdateUsersInOrganizationRequest = {
      userId: currentUserId,
      organizationId,
      userIds,
    };
    return this.organizerService.addUsersToOrganization(request).pipe(map((_) => true));
  }

  removeMembersFromOrganization(currentUserId: number, organizationId: number, userIds: number[]): Observable<boolean> {
    const request: UpdateUsersInOrganizationRequest = {
      userId: currentUserId,
      organizationId,
      userIds,
    };
    return this.organizerService.removeUsersFromOrganization(request).pipe(map((_) => true));
  }

  updateOrganization(userId: number, organization: Organization): Observable<Organization> {
    return this.organizerService
      .updateOrganization({ userId, organization: new OrganizationAdapter().toInterchangeFormat(organization) })
      .pipe(map((org) => new OrganizationAdapter().toEntity(org)));
  }

  setEventQuestions(userId: number, eventId: number, questionGroups: QuestionGroup[]): Observable<boolean> {
    return from([true]);
  }

  setEventTags(userId: number, eventId: number, tagIds: number[]): Observable<number[]> {
    const request: UpdateTagRequest = {
      userId,
      tagIds,
      eventId
    }
    return this.organizerService.addTags(request).pipe(
      map(projectedValue => projectedValue.ids ?? []),
    )
  }

  createEvent(userId: number, event: Event): Observable<Event> {
    const request: CreateEventRequest = {
      userId,
      event: new EventAdapter().toInterchangeFormat(event)
    }

    return this.organizerService.createEvent(request).pipe(
      map((event) => new EventAdapter().toEntity(event))
    )
  }
}
