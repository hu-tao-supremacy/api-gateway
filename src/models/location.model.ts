import { Location as ILocation } from '@gql/common/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Location implements ILocation {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  googleMapUrl: string;

  @Field({ nullable: true })
  travelInformationImageUrl: string | undefined;

  @Field({ nullable: true })
  travelInformationImageHash: string | undefined;
}
