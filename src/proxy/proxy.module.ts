import { Global, Module } from '@nestjs/common';
import { AccountService } from './account/account.service';
import { FacilityService } from './facility/facility.service';
import { OrganizerService } from './organizer/organizer.service';
import { ParticipantService } from './participant/participant.service';

@Global()
@Module({
  providers: [AccountService, FacilityService, OrganizerService, ParticipantService],
  exports: [AccountService, FacilityService, OrganizerService, ParticipantService],
})
export class ProxyModule { }
