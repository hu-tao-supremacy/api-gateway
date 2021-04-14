import { ParticipantService } from '@onepass/participant/participant.service';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class AttendanceContextResolver {
  constructor(private readonly participantService: ParticipantService) {}
}
