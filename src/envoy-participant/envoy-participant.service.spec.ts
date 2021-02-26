import { Test, TestingModule } from '@nestjs/testing';
import { EnvoyParticipantService } from './envoy-participant.service';

describe('EnvoyParticipantService', () => {
  let service: EnvoyParticipantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvoyParticipantService],
    }).compile();

    service = module.get<EnvoyParticipantService>(EnvoyParticipantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
