import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common';
import { EventLocation } from './event-location.model';
import { EventTag } from './event-tag.model';
import { Organization } from './organization.model';

@ObjectType()
export class Event implements common.Event {
  @Field((_) => Int)
  id: number;

  @Field((_) => Int)
  organizationId: number;

  @Field((_) => Int, { nullable: true })
  eventLocationId: number | undefined;

  @Field()
  description: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  coverImage: string | undefined;

  @Field({ nullable: true })
  coverImageHash: string | undefined;

  @Field({ nullable: true })
  posterImage: string | undefined;

  @Field({ nullable: true })
  posterImageHash: string | undefined;

  @Field()
  contact: string;

  @Field((_) => Organization)
  organization: Organization;

  @Field((_) => EventLocation, { nullable: true })
  eventLocation: EventLocation | undefined;

  @Field((_) => [EventTag])
  eventTags: EventTag[];
}
