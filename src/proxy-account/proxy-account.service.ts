import {
  AccountServiceClient,
  ACCOUNT_SERVICE_NAME,
  HTS_ACCOUNT_PACKAGE_NAME,
} from '@internal/account/service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BoolValue } from '@google/wrappers';
import { Account } from '../models/account.model';
import { map } from 'rxjs/operators';

@Injectable()
export class ProxyAccountService implements OnModuleInit {
  private accountService: AccountServiceClient;

  constructor(@Inject(HTS_ACCOUNT_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.accountService = this.client.getService<AccountServiceClient>(
      ACCOUNT_SERVICE_NAME,
    );
  }

  ping(): Observable<BoolValue> {
    return this.accountService.ping({});
  }

  getUserByChulaId(id: number): Observable<Account> {
    return this.accountService
      .getUserByChulaId({ id })
      .pipe(map((user) => Account.from(user)));
  }

  generateAccessToken(userId: number): Observable<string> {
    return this.accountService
      .generateAccessToken({ userId })
      .pipe(map((project) => project.accessToken));
  }
}
