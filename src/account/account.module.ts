import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HTS_ACCOUNT_PACKAGE_NAME } from 'apis/gen/nest/hts/account/service';
import { join } from 'path';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: HTS_ACCOUNT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: HTS_ACCOUNT_PACKAGE_NAME,
          protoPath: join(
            __dirname,
            '../../../apis/proto/hts/account/service.proto',
          ),
          loader: {
            includeDirs: [join(__dirname, '../../../apis/proto')],
          },
        },
      },
    ]),
  ],
  providers: [AccountResolver, AccountService],
})
export class AccountModule {}
