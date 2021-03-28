import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class FileUploadInput {
  @Field((_) => GraphQLUpload)
  file: FileUpload;
}
