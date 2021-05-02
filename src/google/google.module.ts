import { Global, Module } from '@nestjs/common';
import { GoogleService } from './google.service';

@Global()
@Module({
  providers: [GoogleService],
})
export class GoogleModule {}
