import { Field, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProxyParticipantService } from 'src/proxy-participant/proxy-participant.service';
import { EventTag } from 'src/models/event-tag.model';
import { ProxyOrganizerService } from 'src/proxy-organizer/proxy-organizer.service';

@Resolver((_) => EventTag)
export class EventResolver {
  constructor(
    private readonly proxyParticipantService: ProxyParticipantService,
    private readonly proxyOrganizerService: ProxyOrganizerService,
  ) {}

  @ResolveField()
  tag(@Parent() eventTag: EventTag) {}
}
