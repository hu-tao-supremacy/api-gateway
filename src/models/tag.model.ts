import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common_pb.d';

@ObjectType()
export class Tag implements common.Tag.AsObject {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;
}
