import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common';

@ObjectType()
export class Event implements common.Event {
  @Field((_) => Int)
  id: number;

  @Field((_) => Int)
  organizationId: number;

  @Field((_) => Int)
  eventLocationId: number;

  @Field()
  description: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  coverImage?: string;

  @Field({ nullable: true })
  coverImageHash?: string;

  @Field({ nullable: true })
  posterImage?: string;

  @Field({ nullable: true })
  posterImageHash?: string;
}
