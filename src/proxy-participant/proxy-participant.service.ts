import { BoolValue } from '@google/wrappers';
import {
  Event as EventInput,
  Location as LocationInput,
} from '@internal/common/common';
import { Location } from '@gql/common/common';
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
import { DateTime } from 'luxon';
import { Timestamp } from 'apis/gen/gql/google/protobuf/timestamp';

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
      map((events: EventInput[]) => {
        const eventArray: Event[] = events.map((e) => Event.from(e));
        return eventArray;
      }),
    );
  }

  getUpcomingEvents(startDate: string, endDate: string): Observable<Event[]> {
    const start: Timestamp = {
      seconds: DateTime.fromISO(startDate).toMillis(),
      nanos: 0,
    };

    const end: Timestamp = {
      seconds: DateTime.fromISO(endDate).toMillis(),
      nanos: 0,
    };

    return this.participantService.getUpcomingEvents({ start, end }).pipe(
      map((project) => project.event),
      map((events) => {
        return events.map((event) => Event.from(event));
      }),
    );
  }

  getLocationById(locationId: number): Observable<Location> {
    return this.participantService.getLocationById({ id: locationId }).pipe(
      map((location) => {
        const {
          description,
          travelInformationImageHash,
          travelInformationImageUrl,
          ...a
        } = location;

        const ret: Location = {
          ...a,
          description: description?.value,
          travelInformationImageHash: travelInformationImageHash?.value,
          travelInformationImageUrl: travelInformationImageUrl?.value,
        };

        return ret;
      }),
    );
  }
}
