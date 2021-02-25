import { Query, Resolver } from '@nestjs/graphql';
import { Event } from 'src/models/event.model';
import { ParticipantService } from './participant.service';

@Resolver((_) => Event)
export class ParticipantResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @Query((_) => [Event])
  async getAllEvents() {
    return this.participantService.getAllEvents();
  }
}
