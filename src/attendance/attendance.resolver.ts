import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Answer, Attendance } from '@onepass/entities';
import { ParticipantService } from '@onepass/participant/participant.service';

@Resolver(() => Attendance)
export class AttendanceResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @ResolveField(() => [Answer])
  answers(@Parent() attendance: Attendance) {
    return this.participantService.getAnswers(attendance.id);
  }
}
