import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  FacilityServiceClient,
  FACILITY_SERVICE_NAME,
  HTS_FACILITY_PACKAGE_NAME,
} from '@internal/facility/service';
import { ClientGrpc } from '@nestjs/microservices';
import { Result } from '@internal/common/common';
import { Observable } from 'rxjs';

@Injectable()
export class ProxyFacilityService implements OnModuleInit {
  private facilityService: FacilityServiceClient;

  constructor(@Inject(HTS_FACILITY_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.facilityService = this.client.getService<FacilityServiceClient>(
      FACILITY_SERVICE_NAME,
    );
  }

  ping(): Observable<Result> {
    return this.facilityService.ping({});
  }
}
