import { Test, TestingModule } from '@nestjs/testing';
import { UserOrganizationResolver } from './user-organization.resolver';

describe('UserOrganizationResolver', () => {
  let resolver: UserOrganizationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOrganizationResolver],
    }).compile();

    resolver = module.get<UserOrganizationResolver>(UserOrganizationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
