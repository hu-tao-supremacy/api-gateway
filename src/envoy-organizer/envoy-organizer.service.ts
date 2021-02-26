import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  HTS_ORGANIZER_PACKAGE_NAME,
  OrganizationServiceClient,
  ORGANIZATION_SERVICE_NAME,
} from '../apis/hts/organizer/service';
import * as common from '../apis/hts/common/common';
import { from, Observable, of } from 'rxjs';

@Injectable()
export class EnvoyOrganizerService implements OnModuleInit {
  private organizerService: OrganizationServiceClient;

  constructor(@Inject(HTS_ORGANIZER_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.organizerService = this.client.getService<OrganizationServiceClient>(
      ORGANIZATION_SERVICE_NAME,
    );
  }

  getOrganizationById(organizationId: number): Observable<common.Organization> {
    let organization: common.Organization = {
      id: organizationId,
      name: 'HU TAO SUPREMACY',
      isVerified: true,
    };

    return from([organization]);
  }

  getEventLocationById(
    eventLocationId: number,
  ): Observable<common.EventLocation> {
    let eventLocation: common.EventLocation = {
      id: eventLocationId,
      name: 'nh/348320',
      latitude: 348320,
      longitude: 348320,
    };

    return from([eventLocation]);
  }
}
