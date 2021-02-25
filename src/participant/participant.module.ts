import { Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';

@Module({
  imports: [],
  providers: [ParticipantService],
})
export class ParticipantModule {}
