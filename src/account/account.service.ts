import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Result } from 'src/apis/hts/common/common';
import {
  HTS_ACCOUNT_PACKAGE_NAME,
  ACCOUNT_SERVICE_NAME,
  AccountServiceClient,
  IsAuthenticatedRequest,
} from '../apis/hts/account/service';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountService: AccountServiceClient;

  constructor(@Inject(HTS_ACCOUNT_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.accountService = this.client.getService<AccountServiceClient>(
      ACCOUNT_SERVICE_NAME,
    );
  }

  async isAuthenticated(accessToken: string): Promise<Result> {
    let request: IsAuthenticatedRequest = {
      accessToken: accessToken,
    };
    return this.accountService.isAuthenticated(request).toPromise();
  }
}
