import { Organization } from '@onepass/entities';
import { Field, InputType, Int, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateOrganizationInput extends OmitType(Organization, [
  'id',
  'isVerified',
  'events',
  'profilePictureUrl',
  'profilePictureHash',
  'events'
] as const) {
  @Field((_) => GraphQLUpload, { nullable: true })
  profilePicture: Promise<FileUpload>;
}

@InputType()
export class UpdateMembersInOrganizationInput {
  @Field((_) => Int)
  organizationId: number;

  @Field((_) => [String])
  emails: string[];
}

@InputType()
export class UpdateOrganizationInput extends IntersectionType(PartialType(CreateOrganizationInput), PickType(Organization, ['id'] as const)) {}