import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Organization as IOrganization } from '@gql/common/common';

@ObjectType()
export class Organization implements IOrganization {
  @Field((_) => Int)
  id: number;

  @Field()
  name: string;

  @Field((_) => Boolean)
  isVerified: boolean;
}
