import { Args, Field, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Event } from '@onepass/entities';
import { EventService } from './event.service';
import { OrganizerService } from '@onepass/organizer';
import { ParticipantService } from '@onepass/participant';
import { DateTime } from 'luxon';

@Resolver((_) => Event)
export class EventResolver {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly organizerService: OrganizerService,
    private readonly eventService: EventService,
  ) { }

  @Query((_) => [Event])
  async upcomingEvents() {
    return this.participantService.getUpcomingEvents(
      DateTime.now().startOf('day').toISO(),
      DateTime.now().plus({ days: 14 }).endOf('day').toISO(),
    );
  }

  @Query((_) => Event)
  event(@Args('id', { type: () => Int }) id: number) {
    return this.participantService.getEventById(id);
  }

  @ResolveField()
  organization(@Parent() event: Event) {
    const { organizationId } = event;
    return this.organizerService.getOrganizationById(organizationId);
  }

  @ResolveField()
  location(@Parent() event: Event) {
    const { locationId } = event;
    if (!locationId) return null;
    return this.participantService.getLocationById(locationId);
  }

  @ResolveField()
  tags(@Parent() event: Event) {
    const { id } = event;
    return this.participantService.getEventTags(id);
  }

  @ResolveField()
  durations(@Parent() event: Event) {
    const { id } = event;
    return this.participantService.getEventDurationsByEventId(id);
  }
}
