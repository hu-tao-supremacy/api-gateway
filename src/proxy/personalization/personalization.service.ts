import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  HTS_PERSONALIZATION_PACKAGE_NAME,
  PersonalizationServiceClient,
  PERSONALIZATION_SERVICE_NAME,
} from '@onepass/api/personalization/service';

@Injectable()
export class PersonalizationService implements OnModuleInit {
  private service: PersonalizationServiceClient;

  constructor(@Inject(HTS_PERSONALIZATION_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<PersonalizationServiceClient>(PERSONALIZATION_SERVICE_NAME);
  }
}
