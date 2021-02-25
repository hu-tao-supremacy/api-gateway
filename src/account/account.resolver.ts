import { Args, Resolver, Query } from '@nestjs/graphql';
import { Account } from 'src/models/account.model';
import { AccountService } from './account.service';
import { Result } from 'src/models/result.model';

@Resolver((_) => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query((_) => Result)
  async me(@Args('accessToken', { type: () => String }) accessToken: string) {
    let ret = await this.accountService.isAuthenticated(accessToken);
    return {
      isOk: ret.isOk,
      description: ret.description,
    };
  }
}
