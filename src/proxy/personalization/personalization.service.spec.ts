import { Test, TestingModule } from '@nestjs/testing';
import { PersonalizationService } from './personalization.service';

describe('PersonalizationService', () => {
  let service: PersonalizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalizationService],
    }).compile();

    service = module.get<PersonalizationService>(PersonalizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
