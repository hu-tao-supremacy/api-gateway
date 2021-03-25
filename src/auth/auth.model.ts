import { ObjectType, Field } from '@nestjs/graphql';
import { Account } from '../models/account.model';

@ObjectType()
export class AuthenticateOutput {
  @Field()
  accessToken: string;

  @Field()
  account: Account;
}
