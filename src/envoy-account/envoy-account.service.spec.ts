import { Test, TestingModule } from '@nestjs/testing';
import { EnvoyAccountService } from './envoy-account.service';

describe('EnvoyAccountService', () => {
  let service: EnvoyAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvoyAccountService],
    }).compile();

    service = module.get<EnvoyAccountService>(EnvoyAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
