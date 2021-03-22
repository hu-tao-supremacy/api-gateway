import { Module } from '@nestjs/common';
import { ProxyAccountService } from './proxy-account.service';

@Module({
  providers: [ProxyAccountService]
})
export class ProxyAccountModule {}
