import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventTag as IEventTag } from '@gql/common/common';
import { Tag } from './tag.model';

@ObjectType()
export class EventTag implements IEventTag {
  @Field((_) => Int)
  id: number;

  @Field((_) => Int)
  eventId: number;

  @Field((_) => Int)
  tagId: number;

  @Field((_) => Tag)
  tag: Tag;
}
