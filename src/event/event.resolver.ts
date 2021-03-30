import { Field, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProxyParticipantService } from 'src/proxy-participant/proxy-participant.service';
import { Event } from '@entities/event.entity';
import { EventService } from './event.service';
import { map } from 'rxjs/operators';
import { ProxyOrganizerService } from 'src/proxy-organizer/proxy-organizer.service';
import { DateTime } from 'luxon';

@Resolver((_) => Event)
export class EventResolver {
  constructor(
    private readonly proxyParticipantService: ProxyParticipantService,
    private readonly proxyOrganizerService: ProxyOrganizerService,
    private readonly eventService: EventService,
  ) {}

  @Query((_) => [Event])
  async upcomingEvents() {
    return this.proxyParticipantService.getUpcomingEvents(
      DateTime.now().startOf('day').toISO(),
      DateTime.now().plus({ days: 14 }).endOf('day').toISO(),
    );
  }

  @ResolveField()
  organization(@Parent() event: Event) {
    const { organizationId } = event;
    return this.proxyOrganizerService.getOrganizationById(organizationId);
  }

  @ResolveField()
  location(@Parent() event: Event) {
    const { locationId } = event;
    if (!locationId) return null;
    return this.proxyParticipantService.getLocationById(locationId);
  }

  @ResolveField()
  tags(@Parent() event: Event) {
    const { id } = event;
    return this.proxyParticipantService.getEventTags(id);
  }

  @ResolveField()
  durations(@Parent() event: Event) {
    const { id } = event;
    return this.proxyParticipantService.getEventDurationsByEventId(id);
  }
}
