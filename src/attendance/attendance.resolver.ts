import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AccountService } from '@onepass/account/account.service';
import { Answer, Event, User, UserEvent } from '@onepass/entities';
import { ParticipantService } from '@onepass/participant/participant.service';

@Resolver(() => UserEvent)
export class AttendanceResolver {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly accountService: AccountService,
  ) {}

  @ResolveField(() => [Answer])
  answers(@Parent() attendance: UserEvent) {
    return this.participantService.getAnswers(attendance.id);
  }

  @ResolveField(() => User)
  user(@Parent() attendance: UserEvent) {
    return this.accountService.getUserById(attendance.userId);
  }

  @ResolveField(() => Event)
  event(@Parent() attendance: UserEvent) {
    return this.participantService.getEventById(attendance.eventId);
  }
}
