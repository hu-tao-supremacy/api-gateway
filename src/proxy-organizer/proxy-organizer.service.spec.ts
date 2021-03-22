import { Test, TestingModule } from '@nestjs/testing';
import { ProxyOrganizerService } from './proxy-organizer.service';

describe('ProxyOrganizerService', () => {
  let service: ProxyOrganizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProxyOrganizerService],
    }).compile();

    service = module.get<ProxyOrganizerService>(ProxyOrganizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
