import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HTS_ACCOUNT_PACKAGE_NAME } from 'src/apis/hts/account/service';
import { HTS_PARTICIPANT_PACKAGE_NAME } from 'src/apis/hts/participant/service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: HTS_PARTICIPANT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.HTS_SVC_PARTICIPANT,
          package: HTS_PARTICIPANT_PACKAGE_NAME,
          protoPath: join(
            __dirname,
            '../../../apis/proto/hts/participant/service.proto',
          ),
          loader: {
            includeDirs: [join(__dirname, '../../../apis/proto')],
          },
        },
      },
      {
        name: HTS_ACCOUNT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.HTS_SVC_ACCOUNT,
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
  exports: [ClientsModule],
})
export class GlobalModule {}