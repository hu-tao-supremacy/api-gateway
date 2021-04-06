import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ParticipantService } from '@onepass/participant/participant.service';
import { OrganizerService } from '@onepass/organizer/organizer.service'
import { EventTag } from '@onepass/entities';

@Resolver((_) => EventTag)
export class EventTagResolver {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly organizerService: OrganizerService,
  ) { }

  @ResolveField()
  tag(@Parent() eventTag: EventTag) { }
}
