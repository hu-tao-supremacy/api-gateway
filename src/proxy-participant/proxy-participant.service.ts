import { BoolValue } from '@google/wrappers';
import {
  HTS_PARTICIPANT_PACKAGE_NAME,
  ParticipantServiceClient,
  PARTICIPANT_SERVICE_NAME,
} from '@internal/participant/service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateTime } from 'luxon';
import { EventDuration } from '@entities/event-duration.entity';
import { EventDurationAdapter } from '@adapters/event-duration.adapter';
import { Event } from '@entities/event.entity';
import { EventAdapter } from '@adapters/event.adapter';
import { Tag } from '@entities/tag.entity';
import { TagAdapter } from '@adapters/tag.adapter';
import { Location } from '@entities/location.entity';
import { LocationAdapter } from '@adapters/location.adapter';
import { QuestionGroupType } from '@gql/common/common';
import { QuestionGroup } from '@entities/question-group.entity';
import { Question } from '@entities/question.entity';

@Injectable()
export class ProxyParticipantService implements OnModuleInit {
  private participantService: ParticipantServiceClient;

  constructor(
    @Inject(HTS_PARTICIPANT_PACKAGE_NAME) private client: ClientGrpc,
  ) { }

  onModuleInit() {
    this.participantService = this.client.getService<ParticipantServiceClient>(
      PARTICIPANT_SERVICE_NAME,
    );
  }

  ping(): Observable<BoolValue> {
    return this.participantService.ping({});
  }

  getAllEvents(): Observable<Event[]> {
    return this.participantService.getAllEvents({}).pipe(
      map((data) => data.event),
      map((events) =>
        events.map((event) => new EventAdapter().toEntity(event)),
      ),
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
        map((project) => project.event),
        map((events) =>
          events.map((event) => new EventAdapter().toEntity(event)),
        ),
      );
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
    return this.participantService
      .getEventDurationByEventId({ id: eventId })
      .pipe(
        map((project) => project.eventDurations),
        map((durations) =>
          durations.map((duration) =>
            new EventDurationAdapter().toEntity(duration),
          ),
        ),
      );
  }

  getEventsByOrganizationId(organizationId: number): Observable<Event[]> {
    return this.participantService
      .getEventsByOrganizationId({ id: organizationId })
      .pipe(
        map((project) => project.event),
        map((events) =>
          events.map((event) => new EventAdapter().toEntity(event)),
        ),
      );
  }

  getQuestionGroupsByEventId(eventId: number, type: QuestionGroupType): Observable<QuestionGroup[]> {
    return from([])
  }

  getQuestionsByQuestionGroupId(questionGroupId: number): Observable<Question[]> {
    return from([])
  }
}
