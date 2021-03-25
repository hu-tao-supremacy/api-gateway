import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tag as ITag } from '@gql/common/common';

@ObjectType()
export class Tag implements ITag {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;
}
