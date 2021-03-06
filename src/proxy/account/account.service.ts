import {
  AccountServiceClient,
  HTS_ACCOUNT_PACKAGE_NAME,
  ACCOUNT_SERVICE_NAME,
  Role,
} from '@onepass/api/account/service';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Tag, User, UserOrganization } from '@onepass/entities';
import { UserAdapter } from '@onepass/adapters';
import { BoolValue } from '@google/wrappers';
import { HttpException, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Event, Permission } from '@onepass/api/common/common';
import { UserOrganizationAdapter } from 'src/adapters/user-organization.adapter';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountService: AccountServiceClient;

  constructor(@Inject(HTS_ACCOUNT_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.accountService = this.client.getService<AccountServiceClient>(ACCOUNT_SERVICE_NAME);
  }

  ping(): Observable<BoolValue> {
    return this.accountService.ping({});
  }

  getUserByChulaId(id: string): Observable<User> {
    return this.accountService.getUserByChulaId({ id }).pipe(map((user) => new UserAdapter().toEntity(user)));
  }

  getUserByEmail(email: string): Observable<User> {
    return this.accountService.getUserByEmail({ email }).pipe(map((user) => new UserAdapter().toEntity(user)));
  }

  getUserById(id: number): Observable<User> {
    return this.accountService.getUserById({ id }).pipe(map((user) => new UserAdapter().toEntity(user)));
  }

  generateAccessToken(userId: number): Observable<string> {
    return this.accountService.generateAccessToken({ userId }).pipe(map((project) => project.accessToken));
  }

  isAuthenticated(accessToken: string): Observable<boolean> {
    return this.accountService.isAuthenticated({ accessToken }).pipe(map((project) => project.value));
  }

  searchUser(keyword: string) {
    return this.accountService.searchUser({ keyword }).pipe(
      map((projectedValue) => projectedValue.users),
      map((users) => users.map((user) => new UserAdapter().toEntity(user))),
    );
  }

  createUser(
    firstName: string,
    lastName: string,
    chulaId: string,
    email: string,
    isChulaStudent: boolean,
  ): Observable<User> {
    return this.accountService
      .createUser({ firstName, lastName, chulaId, email, isChulaStudent })
      .pipe(map((user) => new UserAdapter().toEntity(user)));
  }

  updateAccountInfo(user: User): Observable<User> {
    return this.accountService
      .updateAccountInfo(new UserAdapter().toInterchangeFormat(user))
      .pipe(map((project) => new UserAdapter().toEntity(project)));
  }

  hasPermission(userId: Permission, organizationId: number, permission: Permission) {
    return this.accountService.hasPermission({ userId, organizationId, permissionName: permission }).pipe(
      catchError((error: HttpException) => {
        throw new UnauthorizedException(error);
      }),
      map((data) => data.value),
    );
  }

  assignRole(userId: number, organizationId: number, role: Role): Observable<boolean> {
    return this.accountService.assignRole({ userId, organizationId, role }).pipe(map((data) => data.value));
  }

  setInterestedEvents(userId: number, events: number[]) {
    return this.accountService.setInterestedEvents({ userId, eventIds: events }).pipe(map((_) => true));
  }

  setInterestedTags(userId: number, tags: number[]) {
    return this.accountService.setInterestedTags({ userId, tagIds: tags }).pipe(map((_) => true));
  }

  getUserOrganizationsByUserId(userId: number): Observable<UserOrganization[]> {
    return this.accountService.getUserOrganizationsByUserId({ id: userId }).pipe(
      map((projectedValue) => projectedValue.userOrganizations ?? []),
      map((userOrgs) => userOrgs.map((userOrg) => new UserOrganizationAdapter().toEntity(userOrg))),
    );
  }

  getUserOrganizationsByOrganizationId(orgId: number): Observable<UserOrganization[]> {
    return this.accountService.getUserOrganizationsByOrganizationId({ id: orgId }).pipe(
      map((projectedValue) => projectedValue.userOrganizations ?? []),
      map((userOrgs) => userOrgs.map((userOrg) => new UserOrganizationAdapter().toEntity(userOrg))),
    );
  }
}
