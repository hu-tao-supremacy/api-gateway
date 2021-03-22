import { Authenticate } from '@mutations/auth.mutation';
import { Resolver } from '@nestjs/graphql';
import { AuthenticationResponse } from './auth.model';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => AuthenticationResponse)
  authenticate(@Args('data') credentials: Authenticate) {
    return this.service.authenticate(credentials.providerAccessToken);
  }
}
