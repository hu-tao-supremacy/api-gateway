import { BoolValue } from '@google/wrappers';
import {
  Event as EventInput,
  Result as ResultInput,
} from '@internal/common/common';
import { Event, Result } from '@gql/common/common';
import {
  HTS_PARTICIPANT_PACKAGE_NAME,
  ParticipantServiceClient,
  PARTICIPANT_SERVICE_NAME,
} from '@internal/participant/service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
        const eventArray: Event[] = events.map((e) => {
          const {
            locationId,
            coverImageUrl,
            coverImageHash,
            posterImageUrl,
            posterImageHash,
            profileImageUrl,
            profileImageHash,
            ...a
          } = e;

          const ret: Event = {
            ...a,
            locationId: locationId.value,
            coverImageUrl: coverImageUrl.value,
            coverImageHash: coverImageHash.value,
            posterImageUrl: posterImageUrl.value,
            posterImageHash: posterImageHash.value,
            profileImageUrl: profileImageUrl.value,
            profileImageHash: profileImageHash.value,
          };

          return ret;
        });
        return eventArray;
      }),
    );
  }
}
