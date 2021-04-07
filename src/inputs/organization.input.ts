import { Organization } from '@onepass/entities';
import { Field, InputType, Int, OmitType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateOrganizationInput extends OmitType(Organization, [
  'id',
  'isVerified',
  'events',
  'profilePictureUrl',
  'profilePictureHash',
] as const) {
  @Field((_) => GraphQLUpload, { nullable: true })
  profilePicture: Promise<FileUpload>;
}

@InputType()
export class AddMembersToOrganizationInput {
  @Field((_) => Int)
  organizationId: number;

  @Field((_) => [String])
  emails: string[];
}
