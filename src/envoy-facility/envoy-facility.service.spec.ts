import { Test, TestingModule } from '@nestjs/testing';
import { EnvoyFacilityService } from './envoy-facility.service';

describe('EnvoyFacilityService', () => {
  let service: EnvoyFacilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvoyFacilityService],
    }).compile();

    service = module.get<EnvoyFacilityService>(EnvoyFacilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
