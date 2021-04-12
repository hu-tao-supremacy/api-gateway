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
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization, QuestionGroup, Event, Question } from '@onepass/entities';
import { EventAdapter, OrganizationAdapter, QuestionAdapter, QuestionGroupAdapter } from '@onepass/adapters';

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

  async setEventQuestions(userId: number, eventId: number, questionGroups: QuestionGroup[]): Promise<boolean> {
    const createdGroups = await this.organizerService
      .addQuestionGroups({
        userId,
        questionGroups: questionGroups.map((group) => {
          group.eventId = eventId;
          return new QuestionGroupAdapter().toInterchangeFormat(group);
        }),
      })
      .toPromise();

    const groupIds = createdGroups.questionGroups.map((group) => group.id);

    const questions = questionGroups
      .map((group, i) => {
        return group.questions.map((question) => {
          question.questionGroupId = groupIds[i];
          return question;
        });
      })
      .flatMap((data) => data);

    const createdQuestions = await this.organizerService
      .addQuestions({
        userId,
        questions: questions.map((question) => new QuestionAdapter().toInterchangeFormat(question)),
      })
      .toPromise();

    return true;
  }

  setEventTags(userId: number, eventId: number, tagIds: number[]): Observable<number[]> {
    const request: UpdateTagRequest = {
      userId,
      tagIds,
      eventId,
    };
    return this.organizerService.addTags(request).pipe(
      map((projectedValue) => projectedValue.eventTags ?? []),
      map((eventTags) => eventTags.map((eventTag) => eventTag.tagId)),
    );
  }

  createEvent(userId: number, event: Event): Observable<Event> {
    const request: CreateEventRequest = {
      userId,
      event: new EventAdapter().toInterchangeFormat(event),
    };

    return this.organizerService.createEvent(request).pipe(map((event) => new EventAdapter().toEntity(event)));
  }
}
