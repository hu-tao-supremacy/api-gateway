import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Event as IEvent } from '@gql/common/common';
import { Location } from './location.model';
import { Tag } from './tag.model';
import { Organization } from './organization.model';

@ObjectType()
export class Event implements IEvent {
  @Field((_) => Int)
  id: number;

  @Field((_) => Int)
  organizationId: number;

  @Field((_) => Int, { nullable: true })
  locationId: number | undefined;

  @Field()
  description: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  coverImageUrl: string | undefined;

  @Field({ nullable: true })
  coverImageHash: string | undefined;

  @Field({ nullable: true })
  posterImageUrl: string | undefined;

  @Field({ nullable: true })
  posterImageHash: string | undefined;

  @Field({ nullable: true })
  profileImageUrl: string | undefined;

  @Field({ nullable: true })
  profileImageHash: string | undefined;

  @Field()
  contact: string;

  @Field((_) => Int)
  attendeeLimit: number;

  @Field((_) => Organization)
  organization: Organization;

  @Field((_) => Location, { nullable: true })
  location: Location | undefined;

  @Field((_) => [Tag])
  tags: Tag[];
}
