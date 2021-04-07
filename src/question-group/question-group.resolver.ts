import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QuestionGroup } from '@onepass/entities';
import { ParticipantService } from '@onepass/participant/participant.service';

@Resolver(() => QuestionGroup)
export class QuestionGroupResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @ResolveField()
  questions(@Parent() questionGroup: QuestionGroup) {
    return this.participantService.getQuestionsByQuestionGroupId(questionGroup.id);
  }
}
