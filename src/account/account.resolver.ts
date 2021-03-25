import { Query, Resolver } from '@nestjs/graphql';
import { ProxyAccountService } from 'src/proxy-account/proxy-account.service';
import { Account } from 'src/models/account.model';

@Resolver((_) => Account)
export class AccountResolver {
  constructor(private readonly proxyAccountService: ProxyAccountService) {}
}
