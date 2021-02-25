import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HTS_PARTICIPANT_PACKAGE_NAME } from 'apis/gen/nest/hts/participant/service';
import { join } from 'path';
import { ParticipantService } from './participant.service';

@Module({
  imports: [],
  providers: [ParticipantService],
})
export class ParticipantModule {}
