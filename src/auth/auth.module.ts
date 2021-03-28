import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ProxyAccountModule } from 'src/proxy-account/proxy-account.module';
import { ProxyAccountService } from 'src/proxy-account/proxy-account.service';

@Module({
  imports: [HttpModule, ProxyAccountModule],
  providers: [AuthService, ProxyAccountService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
