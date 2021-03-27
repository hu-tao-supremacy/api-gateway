import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Organization as IOrganization } from '@gql/common/common';
import { Organization as OrganizationInput } from '@internal/common/common';

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

  static fromInternal(_org: OrganizationInput): Organization {
    const org = new Organization();
    org.id = _org.id;
    org.name = _org.name;
    org.isVerified = _org.isVerified;
    org.abbreviation = _org.abbreviation?.value;
    org.advisor = _org.advisor?.value;
    org.associatedFaculty = _org.associatedFaculty?.value;
    org.description = _org.description?.value;
    org.facebookPage = _org.facebookPage?.value;
    org.instagram = _org.instagram?.value;
    org.lineOfficialAccount = _org.lineOfficialAccount?.value;
    org.email = _org.email?.value;
    org.contactFullName = _org.contactFullName?.value;
    org.contactEmail = _org.contactEmail?.value;
    org.contactPhoneNumber = _org.contactPhoneNumber?.value;
    org.contactLineId = _org.contactLineId?.value;
    org.profilePictureUrl = _org.profilePictureUrl?.value;
    org.profilePictureHash = _org.profilePictureHash?.value;
    return org;
  }
}
