import { Answer, Tag, User } from '@onepass/entities';
import { InputType, Field, OmitType, PartialType, Int } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(User, ['id', 'chulaId', 'didSetup', 'isChulaStudent', 'profilePictureUrl', 'interests']),
) {
  @Field((_) => GraphQLUpload, { nullable: true })
  profilePicture: Promise<FileUpload>;
}

@InputType()
class CreateAnswerInput extends OmitType(Answer, ['id', 'userEventId', 'userEvent', 'question']) { }

@InputType()
export class CreateJoinRequestInput {
  @Field(_ => Int)
  eventId: number;

  @Field(_ => [CreateAnswerInput])
  answers: Omit<Answer, 'userEvent' | 'question'>[]
}

@InputType()
export class DeleteJoinRequestInput {
  @Field(_ => Int)
  eventId: number;
}

@InputType()
class SetUserInterestsTagsInput extends OmitType(Tag, ['events', 'name']) {}

@InputType()
export class SetUserInterestsInput {
  @Field(() => [SetUserInterestsTagsInput])
  tags: Tag[]
}