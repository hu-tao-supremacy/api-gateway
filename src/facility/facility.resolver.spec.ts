import { Test, TestingModule } from '@nestjs/testing';
import { FacilityResolver } from './facility.resolver';

describe('FacilityResolver', () => {
  let resolver: FacilityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacilityResolver],
    }).compile();

    resolver = module.get<FacilityResolver>(FacilityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
