import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceContextResolver } from './attendance-context.resolver';

describe('AttendanceContextResolver', () => {
  let resolver: AttendanceContextResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceContextResolver],
    }).compile();

    resolver = module.get<AttendanceContextResolver>(AttendanceContextResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
