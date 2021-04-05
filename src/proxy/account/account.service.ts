import { AccountServiceClient, HTS_ACCOUNT_PACKAGE_NAME, ACCOUNT_SERVICE_NAME } from '@onepass/api/account/service';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@onepass/entities';
import { UserAdapter } from '@onepass/adapters';
import { BoolValue } from '@google/wrappers';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

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
}
