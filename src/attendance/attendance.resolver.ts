import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Answer, UserEvent } from '@onepass/entities';
import { ParticipantService } from '@onepass/participant/participant.service';

@Resolver(() => UserEvent)
export class AttendanceResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @ResolveField(() => [Answer])
  answers(@Parent() attendance: UserEvent) {
    return this.participantService.getAnswers(attendance.id);
  }
}
