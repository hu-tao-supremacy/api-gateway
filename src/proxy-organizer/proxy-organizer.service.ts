import { EventLocation, Organization } from '@internal/common/common';
import {
  GetByIdRequest,
  HTS_ORGANIZER_PACKAGE_NAME,
  OrganizerServiceClient,
  ORGANIZER_SERVICE_NAME,
} from '@internal/organizer/service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProxyOrganizerService implements OnModuleInit {
  private organizerService: OrganizerServiceClient;

  constructor(@Inject(HTS_ORGANIZER_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.organizerService = this.client.getService<OrganizerServiceClient>(
      ORGANIZER_SERVICE_NAME,
    );
  }

  getOrganizationById(organizationId: number): Observable<Organization> {
    const request: GetByIdRequest = {
      id: organizationId,
    };

    return this.organizerService
      .getOrganizationById(request)
      .pipe(map((project) => project.organization));
  }
}
