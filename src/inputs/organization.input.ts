import { Organization } from '@entities/organization.entity';
import { Field, InputType, OmitType } from '@nestjs/graphql';
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
