import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HTS_PARTICIPANT_PACKAGE_NAME } from 'apis/gen/nest/hts/participant/service';
import { join } from 'path';
import { ParticipantResolver } from './participant.resolver';
import { ParticipantService } from './participant.service';

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
    ]),
  ],
  providers: [ParticipantResolver, ParticipantService],
})
export class ParticipantModule {}
