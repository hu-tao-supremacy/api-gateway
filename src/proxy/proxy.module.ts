import { Global, Module } from '@nestjs/common';
import { AccountService } from './account/account.service';
import { FacilityService } from './facility/facility.service';
import { OrganizerService } from './organizer/organizer.service';
import { ParticipantService } from './participant/participant.service';
import { HTS_ACCOUNT_PACKAGE_NAME } from '@onepass/api/account/service';
import { HTS_FACILITY_PACKAGE_NAME } from '@onepass/api/facility/service';
import { HTS_ORGANIZER_PACKAGE_NAME } from '@onepass/api/organizer/service';
import { HTS_PARTICIPANT_PACKAGE_NAME } from '@onepass/api/participant/service';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

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
      {
        name: HTS_ORGANIZER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.HTS_SVC_ORGANIZER,
          package: HTS_ORGANIZER_PACKAGE_NAME,
          protoPath: join(
            __dirname,
            '../../../apis/proto/hts/organizer/service.proto',
          ),
          loader: {
            includeDirs: [join(__dirname, '../../../apis/proto')],
          },
        },
      },
      {
        name: HTS_FACILITY_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.HTS_SVC_FACILITY,
          package: HTS_FACILITY_PACKAGE_NAME,
          protoPath: join(
            __dirname,
            '../../../apis/proto/hts/facility/service.proto',
          ),
          loader: {
            includeDirs: [join(__dirname, '../../../apis/proto')],
          },
        },
      },
    ]),
  ],
  providers: [AccountService, FacilityService, OrganizerService, ParticipantService],
  exports: [AccountService, FacilityService, OrganizerService, ParticipantService],
})
export class ProxyModule { }
