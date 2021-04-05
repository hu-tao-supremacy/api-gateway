import { Global, Module } from '@nestjs/common';
import { ProxyAccountService } from './proxy-account.service';

@Global()
@Module({
  providers: [ProxyAccountService],
  exports: [ProxyAccountService]
})
export class ProxyAccountModule { }
