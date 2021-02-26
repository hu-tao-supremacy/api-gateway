import { Test, TestingModule } from '@nestjs/testing';
import { EnvoyOrganizerService } from './envoy-organizer.service';

describe('EnvoyOrganizerService', () => {
  let service: EnvoyOrganizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvoyOrganizerService],
    }).compile();

    service = module.get<EnvoyOrganizerService>(EnvoyOrganizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
