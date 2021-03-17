import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common_pb.d';

@ObjectType()
export class EventLocation implements common.EventLocation.AsObject {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
