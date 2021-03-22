import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { ProxyAccountModule } from 'src/proxy-account/proxy-account.module';
import { ProxyAccountService } from 'src/proxy-account/proxy-account.service';

@Module({
  imports: [ProxyAccountModule],
  providers: [ProxyAccountService, AccountService, AccountResolver],
})
export class AccountModule {}
