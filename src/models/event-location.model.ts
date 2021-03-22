import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventLocation as IEventLocation } from '@gql/common/common';

@ObjectType()
export class EventLocation implements IEventLocation {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
