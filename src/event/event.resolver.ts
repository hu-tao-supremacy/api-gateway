import { Field, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { EnvoyParticipantService } from 'src/envoy-participant/envoy-participant.service';
import { Event } from 'src/models/event.model';
import { EventService } from './event.service';
import { map } from 'rxjs/operators';
import { EnvoyOrganizerService } from 'src/envoy-organizer/envoy-organizer.service';

@Resolver((_) => Event)
export class EventResolver {
  constructor(
    private readonly envoyParticipantService: EnvoyParticipantService,
    private readonly envoyOrganizerService: EnvoyOrganizerService,
    private readonly eventService: EventService,
  ) {}

  @Query((_) => [Event])
  async events() {
    return await this.envoyParticipantService
      .getAllEvents()
      .pipe(
        map((result) => {
          return result.map((event) => {
            event.id = Number(event.id);
            event.organizationId = Number(event.organizationId);
            if (event.eventLocationId !== undefined) {
              event.eventLocationId = Number(event.eventLocationId);
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
    return this.envoyOrganizerService.getOrganizationById(organizationId).pipe(
      map((result) => {
        result.id = Number(result.id);
        return result;
      }),
    );
  }
}
