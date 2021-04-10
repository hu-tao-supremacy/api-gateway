import { Injectable, Inject, OnModuleInit, NotFoundException } from '@nestjs/common';
import {
  ParticipantServiceClient,
  HTS_PARTICIPANT_PACKAGE_NAME,
  PARTICIPANT_SERVICE_NAME,
} from '@onepass/api/participant/service';
import { QuestionGroupType } from '@onepass/api/common/common'
import { ClientGrpc } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { BoolValue } from '@google/wrappers';
import { DateTime } from 'luxon';
import { tap, map, catchError } from 'rxjs/operators';
import {
  EventAdapter,
  EventDurationAdapter,
  TagAdapter,
  LocationAdapter,
  QuestionGroupAdapter,
  QuestionAdapter,
  UserEventAdapter,
  AnswerAdapter,
} from '@onepass/adapters';
import { Event, EventDuration, Tag, Location, QuestionGroup, Question, UserEvent, Answer } from '@onepass/entities';

@Injectable()
export class ParticipantService implements OnModuleInit {
  private participantService: ParticipantServiceClient;

  constructor(@Inject(HTS_PARTICIPANT_PACKAGE_NAME) private client: ClientGrpc) { }

  onModuleInit() {
    this.participantService = this.client.getService<ParticipantServiceClient>(PARTICIPANT_SERVICE_NAME);
  }

  ping(): Observable<BoolValue> {
    return this.participantService.ping({});
  }

  getAllEvents(): Observable<Event[]> {
    return this.participantService.getAllEvents({}).pipe(
      map((data) => data.event ?? []),
      map((events) => events.map((event) => new EventAdapter().toEntity(event))),
    );
  }

  getUpcomingEvents(startDate: string, endDate: string): Observable<Event[]> {
    return this.participantService
      .getUpcomingEvents({
        start: {
          seconds: DateTime.fromISO(startDate).toSeconds(),
          nanos: 0,
        },
        end: {
          seconds: DateTime.fromISO(endDate).toSeconds(),
          nanos: 0,
        },
      })
      .pipe(
        map((project) => project.event ?? []),
        map((events) => events.map((event) => new EventAdapter().toEntity(event))),
      );
  }

  getEventById(id: number): Observable<Event> {
    return this.participantService
      .getEventById({ eventId: id })
      .pipe(map((event) => new EventAdapter().toEntity(event)));
  }

  getLocationById(locationId: number): Observable<Location> {
    return this.participantService
      .getLocationById({ id: locationId })
      .pipe(map((location) => new LocationAdapter().toEntity(location)));
  }

  getEventTags(eventId: number): Observable<Tag[]> {
    return this.participantService.getTagsByEventId({ id: eventId }).pipe(
      map((response) => response.tags ?? []),
      map((tags) => tags.map((tag) => new TagAdapter().toEntity(tag))),
    );
  }

  getEventDurationsByEventId(eventId: number): Observable<EventDuration[]> {
    return this.participantService.getEventDurationsByEventId({ id: eventId }).pipe(
      map((project) => project.eventDurations ?? []),
      map((durations) => durations.map((duration) => new EventDurationAdapter().toEntity(duration))),
    );
  }

  getEventsByOrganizationId(organizationId: number): Observable<Event[]> {
    return this.participantService.getEventsByOrganizationId({ id: organizationId }).pipe(
      map((project) => project.event ?? []),
      map((events) => events.map((event) => new EventAdapter().toEntity(event))),
    );
  }

  getQuestionGroupsByEventId(eventId: number): Observable<QuestionGroup[]> {
    return this.participantService.getQuestionGroupsByEventId({ id: eventId }).pipe(
      map((project) => project.questionGroups ?? []),
      map((questionGroups) => questionGroups.map((group) => new QuestionGroupAdapter().toEntity(group))),
    );
  }

  getQuestionsByQuestionGroupId(questionGroupId: number): Observable<Question[]> {
    return this.participantService.getQuestionsByQuestionGroupId({ id: questionGroupId }).pipe(
      map((project) => project.questions ?? []),
      map((questions) => questions.map((question) => new QuestionAdapter().toEntity(question))),
    );
  }

  getEventsByUserId(userId: number): Observable<Event[]> {
    return this.participantService.getEventsByUserId({ userId }).pipe(
      map((project) => project.event ?? []),
      map((events) => events.map((event) => new EventAdapter().toEntity(event))),
    );
  }

  createJoinRequest(userId: number, eventId: number): Observable<UserEvent> {
    return this.participantService
      .joinEvent({ userId, eventId })
      .pipe(map((userEvent) => new UserEventAdapter().toEntity(userEvent)));
  }

  submitAnswers(userEventId: number, answers: Omit<Answer, 'userEvent' | 'question'>[], type: QuestionGroupType): Observable<Answer[]> {
    return this.participantService.submitAnswersForEventQuestion({ userEventId, answers, type }).pipe(
      map((project) => project.answers ?? []),
      map((answers) => answers.map((answer) => new AnswerAdapter().toEntity(answer))),
    );
  }

  deleteJoinRequest(userId: number, eventId: number): Observable<Event> {
    return this.participantService
      .cancelEvent({ userId, eventId })
      .pipe(map((event) => new EventAdapter().toEntity(event)));
  }

  getUserAnswerByQuestionId(userId: number, questionId: number): Observable<Answer> {
    return this.participantService.getUserAnswerByQuestionId({ userId, questionId }).pipe(
      map(data => new AnswerAdapter().toEntity(data)),
      catchError((error) => {
        throw new NotFoundException()
      }),
    )
  }

  getTags(): Observable<Tag[]> {
    return this.participantService.getAllTags({}).pipe(
      map(project => project.tags ?? []),
      map(tags => tags.map(tag => new TagAdapter().toEntity(tag)))
    )
  }

  getTagById(id: number): Observable<Tag> {
    return null;
  }

  getEventsByTagId(id: number): Observable<Event[]> {
    return this.participantService.getEventsByTagIds({ tagIds: [id] }).pipe(
      map(project => project.event ?? []),
      map(events => events.map(event => new EventAdapter().toEntity(event)))
    )
  }
}
