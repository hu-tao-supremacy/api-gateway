import { AccountServiceClient, ACCOUNT_SERVICE_NAME, HTS_ACCOUNT_PACKAGE_NAME } from '@internal/account/service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BoolValue } from '@google/wrappers';
import { map } from 'rxjs/operators';
import { User } from '@entities/user.entity';
import { UserAdapter } from '@adapters/user.adapter';

@Injectable()
export class ProxyAccountService implements OnModuleInit {
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
}
