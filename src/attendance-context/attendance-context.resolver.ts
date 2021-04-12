import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AttendanceContext } from 'src/entities/attendance-context.entity';

@Resolver(() => AttendanceContext)
export class AttendanceContextResolver {
    @ResolveField()
    user(@Parent() context: AttendanceContext) {
        const userId = context.userId;
    }

    @ResolveField()
    attendance(@Parent() context: AttendanceContext) {
        const attendanceId = context.attendanceId;
    }

    @ResolveField()
    answers(@Parent() context: AttendanceContext) {
        const userId = context.userId;
        const eventId = context.eventId;
    }
}
