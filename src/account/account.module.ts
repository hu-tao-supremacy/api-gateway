import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { EnvoyAccountModule } from 'src/envoy-account/envoy-account.module';
import { EnvoyAccountService } from 'src/envoy-account/envoy-account.service';

@Module({
  imports: [EnvoyAccountModule],
  providers: [EnvoyAccountService, AccountService, AccountResolver],
})
export class AccountModule {}
