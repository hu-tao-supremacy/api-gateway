import { Event, Question, QuestionGroup, Tag } from '@onepass/entities';
import { InputType, Field, OmitType, PartialType, Int, IntersectionType, PickType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
class SetEventQuestionsQuestionInput extends OmitType(Question, ['id', 'answer', 'questionGroup', 'questionGroupId']) {}

@InputType()
class SetEventQuestionsQuestionGroupInput extends OmitType(QuestionGroup, ['id', 'eventId', 'event', 'questions']) {
  @Field(() => [SetEventQuestionsQuestionInput])
  questions: Question[];
}

@InputType()
export class SetEventQuestionsInput {
  @Field(() => Int)
  eventId: number;

  @Field(() => [SetEventQuestionsQuestionGroupInput])
  questionGroups: QuestionGroup[];
}

@InputType()
class SetEventTagsTagInput extends OmitType(Tag, ['name', 'events'] as const) {}

@InputType()
export class SetEventTagsInput {
  @Field(() => Int)
  eventId: number;

  @Field(() => [SetEventTagsTagInput])
  tags: Tag[];
}

@InputType()
export class CreateEventInput extends OmitType(Event, [
  'attendeeCount',
  'attendees',
  'coverImageHash',
  'coverImageUrl',
  'durations',
  'location',
  'locationId',
  'organization',
  'posterImageHash',
  'posterImageUrl',
  'profileImageHash',
  'profileImageUrl',
  'questionGroups',
  'tags',
] as const) {
  @Field(() => GraphQLUpload, { nullable: true })
  coverImage?: Promise<FileUpload>;

  @Field(() => GraphQLUpload, { nullable: true })
  posterImage?: Promise<FileUpload>;

  @Field(() => GraphQLUpload, { nullable: true })
  profileImage?: Promise<FileUpload>;

  @Field(() => [SetEventTagsTagInput], { nullable: true })
  tags?: Tag[];
}

@InputType()
export class UpdateEventInput extends IntersectionType(
  PartialType(CreateEventInput),
  PickType(Event, ['id'] as const),
) {}
