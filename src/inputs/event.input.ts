import { Answer, Question, QuestionGroup, Tag, User } from '@onepass/entities';
import { InputType, Field, OmitType, PartialType, Int } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
class SetEventQuestionsQuestionInput extends OmitType(Question, ['id', 'answer', 'questionGroup', 'questionGroupId']) {}

@InputType()
class SetEventQuestionsQuestionGroupInput extends OmitType(QuestionGroup, ['id', 'eventId', 'event', 'questions']) {
  @Field(() => [SetEventQuestionsQuestionInput])
  questions: Question[]
}

@InputType()
export class SetEventQuestionsInput {
  @Field(() => Int)
  eventId: number;

  @Field(() => [SetEventQuestionsQuestionGroupInput])
  questionGroups: QuestionGroup[];
}
