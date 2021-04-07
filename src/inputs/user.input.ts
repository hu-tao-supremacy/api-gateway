import { Answer, User } from '@onepass/entities';
import { InputType, Field, OmitType, PartialType, Int } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(User, ['id', 'chulaId', 'didSetup', 'isChulaStudent', 'profilePictureUrl']),
) {
  @Field((_) => GraphQLUpload, { nullable: true })
  profilePicture: Promise<FileUpload>;
}

@InputType()
export class SubmitEventJoinRequestInput {
  @Field(_ => Int)
  eventId: number;

  @Field(_ => [Answer])
  answers: Omit<Answer, 'userEvent' | 'question'>[]
}