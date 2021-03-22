import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class Authenticate {
  @Field()
  providerAccessToken: string;
}
