import { AuthenticateInput } from '@inputs/auth.input';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthenticateOutput } from './auth.model';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => AuthenticateOutput)
  authenticate(@Args('input') input: AuthenticateInput) {
    return this.service.authenticate(input.providerAccessToken);
  }
}
