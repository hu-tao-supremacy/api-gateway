import { Event, Location, Question, QuestionGroup, Tag, UserEvent } from '@onepass/entities';
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
export class CreateEventLocationInput extends OmitType(Location, [
  'id',
  'travelInformationImageUrl',
  'travelInformationImageHash',
] as const) {}

@InputType()
export class CreateEventInput extends OmitType(Event, [
  'id',
  'coverImageHash',
  'coverImageUrl',
  'durations',
  'locationId',
  'organization',
  'posterImageHash',
  'posterImageUrl',
  'questionGroups',
  'tags',
] as const) {
  @Field(() => GraphQLUpload, { nullable: true })
  coverImage?: Promise<FileUpload>;

  @Field(() => CreateEventLocationInput, { nullable: true })
  location?: Location;

  @Field(() => GraphQLUpload, { nullable: true })
  posterImage?: Promise<FileUpload>;

  @Field(() => [SetEventTagsTagInput], { nullable: true })
  tags?: Tag[];
}

@InputType()
export class UpdateEventInput extends IntersectionType(
  PartialType(CreateEventInput),
  PickType(Event, ['id', 'organizationId'] as const),
) {}

@InputType()
export class ReviewJoinRequestInput extends OmitType(UserEvent, ['id', 'event', 'ticket', 'ticket']) {}
