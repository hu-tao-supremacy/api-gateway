import { Location as ILocation } from '@gql/common/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Location as LocationDTO } from '@internal/common/common';

@ObjectType()
export class Location implements ILocation {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string | undefined;

  @Field()
  googleMapUrl: string;

  @Field({ nullable: true })
  travelInformationImageUrl: string | undefined;

  @Field({ nullable: true })
  travelInformationImageHash: string | undefined;

  static from(_location: LocationDTO): Location {
    const location = new Location();
    location.id = Number(_location.id.toString());
    location.name = _location.name;
    location.description = _location.description?.value;
    location.googleMapUrl = _location.googleMapUrl;
    location.travelInformationImageUrl =
      _location.travelInformationImageUrl?.value;
    location.travelInformationImageHash =
      _location.travelInformationImageHash?.value;
    return location;
  }
}
