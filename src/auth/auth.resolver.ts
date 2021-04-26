import { AuthenticateInput } from '@onepass/inputs/auth.input';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthenticateOutput } from './auth.model';
import { AuthService } from './auth.service';
import { decode } from 'js-base64';
import { If } from 'src/decorators/if.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => AuthenticateOutput)
  authenticate(@Args('input') input: AuthenticateInput) {
    return this.service.authenticate(input.providerAccessToken);
  }

  @If(process.env.NODE_ENV === 'dev', Mutation(() => AuthenticateOutput))
  signInWithServiceAccount(@Args('serviceAccount') input: string) {
    const serviceAccount = JSON.parse(decode(input)) as any;
    return this.service.signInWithServiceAccount(serviceAccount);
  }

  // @If(process.env.NODE_ENV === 'dev', Mutation(() => AuthenticateOutput))
  async generateAccessToken(@Args('userId') userId: number) {
    return { accessToken: await this.service.generateAccessToken(userId).toPromise() };
  }
}
