import { Field, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProxyParticipantService } from 'src/proxy-participant/proxy-participant.service';
import { Event } from 'src/models/event.model';
import { EventService } from './event.service';
import { map } from 'rxjs/operators';
import { ProxyOrganizerService } from 'src/proxy-organizer/proxy-organizer.service';

@Resolver((_) => Event)
export class EventResolver {
  constructor(
    private readonly proxyParticipantService: ProxyParticipantService,
    private readonly proxyOrganizerService: ProxyOrganizerService,
    private readonly eventService: EventService,
  ) {}

  @Query((_) => [Event])
  async upcomingEvents() {
    return await this.proxyParticipantService.getAllEvents().toPromise();
  }

  @ResolveField()
  organization(@Parent() event: Event) {
    return null;
  }

  @ResolveField()
  location(@Parent() event: Event) {
    const { locationId } = event;
    if (!locationId) return null;
    return this.proxyParticipantService.getLocationById(locationId);
  }

  @ResolveField()
  tags(@Parent() event: Event) {
    return [];
  }
}
