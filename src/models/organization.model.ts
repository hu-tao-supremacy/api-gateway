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

  @Field({ nullable: true })
  abbreviation: string | undefined;

  @Field({ nullable: true })
  advisor: string | undefined;

  @Field({ nullable: true })
  associatedFaculty: string | undefined;

  @Field({ nullable: true })
  description: string | undefined;

  @Field({ nullable: true })
  facebookPage: string | undefined;

  @Field({ nullable: true })
  instagram: string | undefined;

  @Field({ nullable: true })
  lineOfficialAccount: string | undefined;

  @Field({ nullable: true })
  email: string | undefined;

  @Field({ nullable: true })
  contactFullName: string | undefined;

  @Field({ nullable: true })
  contactEmail: string | undefined;

  @Field({ nullable: true })
  contactPhoneNumber: string | undefined;

  @Field({ nullable: true })
  contactLineId: string | undefined;

  @Field({ nullable: true })
  profilePictureUrl: string | undefined;

  @Field({ nullable: true })
  profilePictureHash: string | undefined;
}
