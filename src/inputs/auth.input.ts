import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthenticateInput {
  @Field()
  ticket: string;
}
