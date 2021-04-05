import { InputType, Field } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class FileUploadInput {
  @Field((_) => GraphQLUpload)
  file: Promise<FileUpload>;
}
