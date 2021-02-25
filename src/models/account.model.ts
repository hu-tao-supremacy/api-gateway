import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common';

@ObjectType()
export class Account implements common.User {
  @Field((_) => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  nickname: string;

  @Field()
  isChulaStudent: boolean;

  @Field({ nullable: true })
  chulaId: string | undefined;

  @Field((_) => common.Gender)
  gender: common.Gender;
}
