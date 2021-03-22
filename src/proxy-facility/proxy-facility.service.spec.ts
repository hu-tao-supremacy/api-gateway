import { Test, TestingModule } from '@nestjs/testing';
import { ProxyFacilityService } from './proxy-facility.service';

describe('ProxyFacilityService', () => {
  let service: ProxyFacilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyFacilityService],
    }).compile();

    service = module.get<ProxyFacilityService>(ProxyFacilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
