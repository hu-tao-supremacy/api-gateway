import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AccountServiceClient,
  ACCOUNT_SERVICE_NAME,
  HTS_ACCOUNT_PACKAGE_NAME,
} from 'src/apis/hts/account/service';
import { map } from 'rxjs/operators';

@Injectable()
export class EnvoyAccountService implements OnModuleInit {
  private accountService: AccountServiceClient;

  constructor(@Inject(HTS_ACCOUNT_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.accountService = this.client.getService<AccountServiceClient>(
      ACCOUNT_SERVICE_NAME,
    );
  }

  isAuthenticated(accessToken: string): Observable<boolean> {
    return this.accountService
      .isAuthenticated({ accessToken })
      .pipe(map((result) => result.isOk));
  }
}
