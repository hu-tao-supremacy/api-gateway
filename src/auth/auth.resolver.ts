import { AuthenticateInput } from '@inputs/auth.input';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthenticateOutput } from './auth.model';
import { AuthService } from './auth.service';
import { decode } from 'js-base64';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => AuthenticateOutput)
  authenticate(@Args('input') input: AuthenticateInput) {
    return this.service.authenticate(input.providerAccessToken);
  }

  @Mutation(() => AuthenticateOutput)
  signInWithServiceAccount(@Args('serviceAccount') input: string) {
    const serviceAccount = JSON.parse(decode(input)) as any;
    return this.service.signInWithServiceAccount(serviceAccount);
  }
}
