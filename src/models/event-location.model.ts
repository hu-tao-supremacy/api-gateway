import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventLocation } from '@gql/common/common';

@ObjectType()
export class EventLocation implements EventLocation {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
