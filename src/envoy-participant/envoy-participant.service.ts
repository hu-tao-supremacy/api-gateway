import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  HTS_PARTICIPANT_PACKAGE_NAME,
  ParticipantServiceClient,
  PARTICIPANT_SERVICE_NAME,
} from 'src/apis/hts/participant/service';
import * as common from '../apis/hts/common/common';
import { map } from 'rxjs/operators';

@Injectable()
export class EnvoyParticipantService implements OnModuleInit {
  private participantService: ParticipantServiceClient;

  constructor(
    @Inject(HTS_PARTICIPANT_PACKAGE_NAME) private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.participantService = this.client.getService<ParticipantServiceClient>(
      PARTICIPANT_SERVICE_NAME,
    );
  }

  getAllEvents(): Observable<common.Event[]> {
    return this.participantService
      .getAllEvents({})
      .pipe(map((result) => result.event));
  }
}
