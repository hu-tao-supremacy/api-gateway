import { User } from '@entities/user.entity';
import { Resolver } from '@nestjs/graphql';
import { ProxyAccountService } from 'src/proxy-account/proxy-account.service';

@Resolver((_) => User)
export class AccountResolver {
  constructor(private readonly proxyAccountService: ProxyAccountService) { }
}
