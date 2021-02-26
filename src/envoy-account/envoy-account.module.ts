import { Module } from '@nestjs/common';
import { EnvoyAccountService } from './envoy-account.service';

@Module({
  providers: [EnvoyAccountService],
  exports: [EnvoyAccountService],
})
export class EnvoyAccountModule {}
