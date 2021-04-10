import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { QuestionGroup } from '@onepass/entities';
import { ParticipantService } from '@onepass/participant/participant.service';
import { map } from 'rxjs/operators';

@Resolver(() => QuestionGroup)
export class QuestionGroupResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @ResolveField()
  questions(@Parent() questionGroup: QuestionGroup) {
    return this.participantService.getQuestionsByQuestionGroupId(questionGroup.id).pipe(
      map((questions) => {
        return questions.sort((a, b) => a.seq - b.seq);
      }),
    );
  }
}
