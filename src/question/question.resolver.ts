import { UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Question, User } from '@onepass/entities';
import { ParticipantService } from '@onepass/participant/participant.service';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @UseGuards(AuthGuard)
  @ResolveField()
  answer(@CurrentUser() currentUser: User, @Parent() question: Question) {
    return this.participantService.getUserAnswerByQuestionId(currentUser.id, question.id);
  }
}
