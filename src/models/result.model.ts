import { Field, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common_pb.d';

@ObjectType()
export class Result implements common.Result.AsObject {
  @Field((_) => Boolean)
  isOk: boolean;

  @Field()
  description: string;
}
