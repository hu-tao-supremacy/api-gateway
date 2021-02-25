import { Field, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common';

@ObjectType()
export class Result implements common.Result {
  @Field((_) => Boolean)
  isOk: boolean;

  @Field()
  description: string;
}
