import { Global, HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule { }
