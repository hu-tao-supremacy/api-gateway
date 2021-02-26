import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common';
import { Organization } from './organization.model';

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
}
