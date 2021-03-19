import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProxyAccountModule } from 'src/proxy-account/proxy-account.module';
import { ProxyOrganizerModule } from 'src/proxy-organizer/proxy-organizer.module';
import { ProxyParticipantModule } from 'src/proxy-participant/proxy-participant.module';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: ProxyParticipantModule.name,
        transport: Transport.GRPC,
        options: {
          url: process.env.HTS_SVC_PARTICIPANT,
          package: ProxyParticipantModule.name,
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
        name: ProxyAccountModule.name,
        transport: Transport.GRPC,
        options: {
          url: process.env.HTS_SVC_ACCOUNT,
          package: ProxyAccountModule.name,
          protoPath: join(
            __dirname,
            '../../../apis/proto/hts/account/service.proto',
          ),
          loader: {
            includeDirs: [join(__dirname, '../../../apis/proto')],
          },
        },
      },
      {
        name: ProxyOrganizerModule.name,
        transport: Transport.GRPC,
        options: {
          url: process.env.HTS_SVC_ORGANIZER,
          package: ProxyOrganizerModule.name,
          protoPath: join(
            __dirname,
            '../../../apis/proto/hts/organizer/service.proto',
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
