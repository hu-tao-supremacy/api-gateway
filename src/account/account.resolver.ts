import { Query, Resolver } from '@nestjs/graphql';
import { EnvoyAccountService } from 'src/envoy-account/envoy-account.service';
import { Account } from 'src/models/account.model';

@Resolver((_) => Account)
export class AccountResolver {
  constructor(private readonly envoyAccountService: EnvoyAccountService) {}
}
