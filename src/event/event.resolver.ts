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
  async events() {
    return await this.proxyParticipantService
      .getAllEvents()
      .pipe(
        map((result) => {
          return result.map((event) => {
            console.log(event);
            event.id = Number(event.id);
            event.organizationId = Number(event.organizationId);
            if (event.eventLocationId !== undefined) {
              // @ts-ignore
              event.eventLocationId = Number(event.eventLocationId.value);
            }
            return event;
          });
        }),
      )
      .toPromise();
  }

  @ResolveField()
  organization(@Parent() event: Event) {
    const { organizationId } = event;
    return this.proxyOrganizerService.getOrganizationById(organizationId).pipe(
      map((result) => {
        result.id = Number(result.id);
        return result;
      }),
    );
  }

  @ResolveField()
  eventLocation(@Parent() event: Event) {
    const { eventLocationId } = event;

    if (eventLocationId === undefined) {
      return null;
    }

    return this.proxyOrganizerService
      .getEventLocationById(eventLocationId)
      .pipe(
        map((result) => {
          result.id = Number(result.id);
          return result;
        }),
      );
  }

  @ResolveField()
  eventTags(@Parent() event: Event) {}
}
