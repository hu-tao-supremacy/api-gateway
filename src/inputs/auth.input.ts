import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthenticateInput {
  @Field()
  providerAccessToken: string;
}
