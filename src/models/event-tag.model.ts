import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common';
import { Tag } from './tag.model';

@ObjectType()
export class EventTag implements common.EventTag {
  @Field((_) => Int)
  id: number;

  @Field((_) => Int)
  eventId: number;

  @Field((_) => Int)
  tagId: number;

  @Field((_) => Tag)
  tag: Tag;
}
