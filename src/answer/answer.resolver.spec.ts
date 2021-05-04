import { Test, TestingModule } from '@nestjs/testing';
import { AnswerResolver } from './answer.resolver';

describe('AnswerResolver', () => {
  let resolver: AnswerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerResolver],
    }).compile();

    resolver = module.get<AnswerResolver>(AnswerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
