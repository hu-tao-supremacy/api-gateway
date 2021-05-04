import { ResolveField, Parent, Resolver } from '@nestjs/graphql';
import { Answer, Question } from '@onepass/entities';
import { ParticipantService } from '@onepass/participant/participant.service';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @ResolveField(() => Question)
  question(@Parent() answer: Answer) {
    return this.participantService.getQuestionById(answer.questionId);
  }
}
