import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Event as IEvent } from '@gql/common/common';
import { Location } from './location.model';
import { Tag } from './tag.model';
import { Organization } from './organization.model';
import { Event as EventDTO } from '@internal/common/common';

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

  static from(_event: EventDTO): Event {
    const event = new Event();
    event.id = Number(_event.id.toString());
    event.organizationId = _event.organizationId;
    event.locationId = _event.locationId
      ? Number(_event.locationId?.toString())
      : null;
    event.description = _event.description;
    event.name = _event.name;
    event.coverImageUrl = _event.coverImageUrl?.value;
    event.coverImageHash = _event.coverImageHash?.value;
    event.posterImageUrl = _event.posterImageUrl?.value;
    event.posterImageHash = _event.posterImageHash?.value;
    event.profileImageUrl = _event.profileImageUrl?.value;
    event.profileImageHash = _event.profileImageHash?.value;
    event.contact = _event.contact;
    event.attendeeLimit = _event.attendeeLimit;
    return event;
  }
}
