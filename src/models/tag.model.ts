import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Tag as ITag } from '@gql/common/common';
import { Tag as TagDTO } from '@internal/common/common';

@ObjectType()
export class Tag implements ITag {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;

  static from(_tag: TagDTO): Tag {
    const tag = new Tag();
    tag.id = Number(_tag.id);
    tag.name = _tag.name;
  }
}
