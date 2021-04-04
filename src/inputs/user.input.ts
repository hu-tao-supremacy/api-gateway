import { User } from '@entities/user.entity';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UpdateUserInput extends OmitType(User, ['id', 'chulaId', 'didSetup', 'isChulaStudent', 'profilePictureUrl']) {
    @Field((_) => GraphQLUpload, { nullable: true })
    profilePicture: Promise<FileUpload>;
}
