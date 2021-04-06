import { Test, TestingModule } from '@nestjs/testing';
import { QuestionGroupResolver } from './question-group.resolver';

describe('QuestionGroupResolver', () => {
  let resolver: QuestionGroupResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionGroupResolver],
    }).compile();

    resolver = module.get<QuestionGroupResolver>(QuestionGroupResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
