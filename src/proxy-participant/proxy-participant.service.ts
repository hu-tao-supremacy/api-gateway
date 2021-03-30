import { BoolValue } from '@google/wrappers';
import {
  HTS_PARTICIPANT_PACKAGE_NAME,
  ParticipantServiceClient,
  PARTICIPANT_SERVICE_NAME,
} from '@internal/participant/service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from 'src/models/event.model';
import { Location } from 'src/models/location.model';
import { Tag } from 'src/models/tag.model';
import { DateTime } from 'luxon';
import { EventDuration } from '@entities/event-duration.entity';
import { EventDurationAdapter } from '@adapters/event-duration.adapter';

@Injectable()
export class ProxyParticipantService implements OnModuleInit {
  private participantService: ParticipantServiceClient;

  constructor(
    @Inject(HTS_PARTICIPANT_PACKAGE_NAME) private client: ClientGrpc,
  ) {}

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
      map((events) => events.map((event) => Event.from(event))),
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
        map((events) => events.map((event) => Event.from(event))),
      );
  }

  getLocationById(locationId: number): Observable<Location> {
    return this.participantService
      .getLocationById({ id: locationId })
      .pipe(map((location) => Location.from(location)));
  }

  getEventTags(eventId: number): Observable<Tag[]> {
    return this.participantService.getTagsByEventId({ id: eventId }).pipe(
      map((response) => response.tags ?? []),
      map((tags) => tags.map((tag) => Tag.from(tag))),
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
}
