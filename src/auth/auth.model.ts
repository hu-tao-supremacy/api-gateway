import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthenticateOutput {
  @Field()
  accessToken: string;
}
