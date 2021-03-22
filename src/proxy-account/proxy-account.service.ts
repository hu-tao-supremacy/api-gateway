import {
  AccountServiceClient,
  ACCOUNT_SERVICE_NAME,
  HTS_ACCOUNT_PACKAGE_NAME,
} from '@internal/account/service';
import { Result } from '@internal/common/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ProxyAccountService implements OnModuleInit {
  private accountService: AccountServiceClient;

  constructor(@Inject(HTS_ACCOUNT_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.accountService = this.client.getService<AccountServiceClient>(
      ACCOUNT_SERVICE_NAME,
    );
  }

  ping(): Observable<Result> {
    return this.accountService.ping({});
  }
}
