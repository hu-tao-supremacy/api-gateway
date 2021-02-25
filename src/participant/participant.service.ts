import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  HTS_PARTICIPANT_PACKAGE_NAME,
  PARTICIPANT_SERVICE_NAME,
  ParticipantServiceClient,
} from '../apis/hts/participant/service';
import * as common from '../apis/hts/common/common';
@Injectable()
export class ParticipantService implements OnModuleInit {
  private participantService: ParticipantServiceClient;

  constructor(
    @Inject(HTS_PARTICIPANT_PACKAGE_NAME) private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.participantService = this.client.getService<ParticipantServiceClient>(
      PARTICIPANT_SERVICE_NAME,
    );
  }

  async getAllEvents(): Promise<common.Event[]> {
    let ret = await this.participantService.getAllEvents({}).toPromise();
    console.log(ret);
    return ret.event;
  }

  async getSuggestedEvents(): Promise<common.Event[]> {
    let ret = await this.participantService.getSuggestedEvents({}).toPromise();
    console.log(ret);
    return ret.event;
  }
}
