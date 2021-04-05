import { OrganizationAdapter } from '@adapters/organization.adapter';
import { Organization } from '@entities/organization.entity';
import {
  HTS_ORGANIZER_PACKAGE_NAME,
  OrganizerServiceClient,
  ORGANIZER_SERVICE_NAME,
  UpdateUsersInOrganizationRequest,
} from '@internal/organizer/service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProxyOrganizerService implements OnModuleInit {
  private organizerService: OrganizerServiceClient;

  constructor(@Inject(HTS_ORGANIZER_PACKAGE_NAME) private client: ClientGrpc) { }

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
      userIds
    }
    return this.organizerService.addUsersToOrganization(request).pipe(map(_ => true))
  }
}
