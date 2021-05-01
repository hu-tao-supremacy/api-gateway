import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Tag, User } from '@onepass/entities';
import { OrganizerService } from '@onepass/organizer/organizer.service';
import { ParticipantService } from '@onepass/participant/participant.service';
import { Observable } from 'rxjs';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Resolver(() => Tag)
export class TagResolver {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly organizerService: OrganizerService,
  ) {}

  @Query(() => [Tag])
  tags(): Observable<Tag[]> {
    return this.participantService.getTags();
  }

  @Query(() => Tag)
  tag(@Args('id', { type: () => Int }) id: number): Observable<Tag> {
    return this.participantService.getTagById(id);
  }

  @ResolveField(() => [Event])
  events(@Parent() tag: Tag) {
    return this.participantService.getEventsByTagId(tag.id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Tag)
  createTag(
    @CurrentUser() currentUser: User,
    @Args('organizationId', { type: () => Int }) organizationId: number,
    @Args('name') name: string,
  ) {
    return this.organizerService.createTag(currentUser.id, organizationId, name);
  }
}
