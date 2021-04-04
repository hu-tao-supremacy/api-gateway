import { User } from '@entities/user.entity';
import { InputType, Field, OmitType, PartialType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UpdateUserInput extends PartialType(OmitType(User, ['id', 'chulaId', 'didSetup', 'isChulaStudent', 'profilePictureUrl'])) {
    @Field((_) => GraphQLUpload, { nullable: true })
    profilePicture: Promise<FileUpload>;
}
