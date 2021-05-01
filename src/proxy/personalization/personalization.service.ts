import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { EventAdapter } from '@onepass/adapters';
import {
  HTS_PERSONALIZATION_PACKAGE_NAME,
  PersonalizationServiceClient,
  PERSONALIZATION_SERVICE_NAME,
} from '@onepass/api/personalization/service';
import { Event } from '@onepass/entities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PersonalizationService implements OnModuleInit {
  private service: PersonalizationServiceClient;

  constructor(@Inject(HTS_PERSONALIZATION_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<PersonalizationServiceClient>(PERSONALIZATION_SERVICE_NAME);
  }

  getRecommendedEvents(userId: number, n: number): Observable<Event[]> {
    return this.service.getRecommendedEvents({ userId, kEvents: n }).pipe(
      map((projectedValue) => projectedValue.eventCollection ?? []),
      map((events) => events.map((event) => new EventAdapter().toEntity(event))),
    );
  }
}
