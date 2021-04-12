import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ParticipantService } from '@onepass/participant/participant.service';
import { AttendanceContext } from 'src/entities/attendance-context.entity';

@Resolver()
export class AttendanceContextResolver {
    constructor(private readonly participantService: ParticipantService) {}
}
