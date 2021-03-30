import { Field, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProxyParticipantService } from 'src/proxy-participant/proxy-participant.service';
import { ProxyOrganizerService } from 'src/proxy-organizer/proxy-organizer.service';
import { EventTag } from '@entities/event-tag.entity';

@Resolver((_) => EventTag)
export class EventResolver {
  constructor(
    private readonly proxyParticipantService: ProxyParticipantService,
    private readonly proxyOrganizerService: ProxyOrganizerService,
  ) { }

  @ResolveField()
  tag(@Parent() eventTag: EventTag) { }
}
