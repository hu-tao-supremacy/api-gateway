import { Field, ObjectType } from '@nestjs/graphql';
import { Result as IResult } from '@gql/common/common';

@ObjectType()
export class Result implements IResult {
  @Field((_) => Boolean)
  isOk: boolean;

  @Field()
  description: string;
}
