import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ParticipantService } from '@onepass/participant/participant.service';
import { AttendanceContext } from 'src/entities/attendance-context.entity';

@Resolver(() => AttendanceContext)
export class AttendanceContextResolver {
    constructor(private readonly participantService: ParticipantService) {}

    @ResolveField()
    user(@Parent() context: AttendanceContext) {
        const userId = context.userId;
    }

    @ResolveField()
    attendance(@Parent() context: AttendanceContext) {
        return this.participantService.getUserEvent(context.userId, context.eventId);
    }

    @ResolveField()
    answers(@Parent() context: AttendanceContext) {
        const userId = context.userId;
        const eventId = context.eventId;
    }
}
