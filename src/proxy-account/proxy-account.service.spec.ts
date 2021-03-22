import { Test, TestingModule } from '@nestjs/testing';
import { ProxyAccountService } from './proxy-account.service';

describe('ProxyAccountService', () => {
  let service: ProxyAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyAccountService],
    }).compile();

    service = module.get<ProxyAccountService>(ProxyAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
