import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import {
  OrganizerServiceClient,
  HTS_ORGANIZER_PACKAGE_NAME,
  ORGANIZER_SERVICE_NAME,
  UpdateUsersInOrganizationRequest,
} from '@onepass/api/organizer/service';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization } from '@onepass/entities';
import { OrganizationAdapter } from '@onepass/adapters';

@Injectable()
export class OrganizerService implements OnModuleInit {
  private organizerService: OrganizerServiceClient;

  constructor(@Inject(HTS_ORGANIZER_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.organizerService = this.client.getService<OrganizerServiceClient>(ORGANIZER_SERVICE_NAME);
  }

  getOrganizationById(organizationId: number): Observable<Organization> {
    return this.organizerService
      .getOrganizationById({
        id: organizationId,
      })
      .pipe(map((org) => new OrganizationAdapter().toEntity(org)));
  }

  getOrganizations(): Observable<Organization[]> {
    return this.organizerService.getOrganizations({}).pipe(
      map((project) => project.organizations),
      map((orgs) => orgs.map((org) => new OrganizationAdapter().toEntity(org))),
    );
  }

  createOrganization(userId: number, organization: Organization): Observable<Boolean> {
    return this.organizerService
      .createOrganization({ userId, organization: new OrganizationAdapter().toInterchangeFormat(organization) })
      .pipe(map((_) => true));
  }

  addMembersToOrganization(currentUserId: number, organizationId: number, userIds: number[]): Observable<boolean> {
    const request: UpdateUsersInOrganizationRequest = {
      userId: currentUserId,
      organizationId,
      userIds,
    };
    return this.organizerService.addUsersToOrganization(request).pipe(map((_) => true));
  }
}
