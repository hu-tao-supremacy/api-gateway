import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common';

@ObjectType()
export class Tag implements common.Tag {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;
}
