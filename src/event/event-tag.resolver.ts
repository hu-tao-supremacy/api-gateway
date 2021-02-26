import { Field, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { EnvoyParticipantService } from 'src/envoy-participant/envoy-participant.service';
import { EventTag } from 'src/models/event-tag.model';
import { EnvoyOrganizerService } from 'src/envoy-organizer/envoy-organizer.service';

@Resolver((_) => EventTag)
export class EventResolver {
  constructor(
    private readonly envoyParticipantService: EnvoyParticipantService,
    private readonly envoyOrganizerService: EnvoyOrganizerService,
  ) {}

  @ResolveField()
  tag(@Parent() eventTag: EventTag) {}
}
