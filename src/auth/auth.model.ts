import { ObjectType, Field } from '@nestjs/graphql';
import { Account } from '../models/account.model';

@ObjectType()
export class AuthenticationResponse {
  @Field()
  accessToken: string;

  @Field()
  account: Account;
}
