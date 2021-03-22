import { Authenticate } from '@mutations/auth.mutation';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthenticationResponse } from './auth.model';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => AuthenticationResponse)
  authenticate(@Args('providerAccessToken') providerAccessToken: string) {
    return this.service.authenticate(providerAccessToken);
  }
}
