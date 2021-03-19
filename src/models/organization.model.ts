import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as common from '../apis/hts/common/common_pb.d';

@ObjectType()
export class Organization implements common.Organization.AsObject {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;

  @Field((_) => Boolean)
  isVerified: boolean;
}