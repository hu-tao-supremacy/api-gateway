import { Test, TestingModule } from '@nestjs/testing';
import { ProxyParticipantService } from './proxy-participant.service';

describe('ProxyParticipantService', () => {
  let service: ProxyParticipantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyParticipantService],
    }).compile();

    service = module.get<ProxyParticipantService>(ProxyParticipantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
