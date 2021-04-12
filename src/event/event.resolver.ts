import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Attendance, Event, PickedQuestionGroupType, PickedUserEventStatus, User } from '@onepass/entities';
import { EventService } from './event.service';
import { OrganizerService } from '@onepass/organizer/organizer.service';
import { ParticipantService } from '@onepass/participant/participant.service';
import { DateTime } from 'luxon';
import { map, tap } from 'rxjs/operators';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CreateEventInput, SetEventQuestionsInput } from '@onepass/inputs/event.input';
import { create, merge } from 'lodash';
import { UserEvent_Status } from '@onepass/graphql/common/common';
import { AttendanceContext } from 'src/entities/attendance-context.entity';

@Resolver((_) => Event)
export class EventResolver {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly organizerService: OrganizerService,
    private readonly eventService: EventService,
  ) {}

  @Query((_) => [Event])
  async upcomingEvents() {
    return this.participantService.getUpcomingEvents(
      DateTime.now().startOf('day').toISO(),
      DateTime.now().plus({ days: 14 }).endOf('day').toISO(),
    );
  }

  @Query((_) => Event)
  event(@Args('id', { type: () => Int }) id: number) {
    return this.participantService.getEventById(id);
  }

  @ResolveField()
  organization(@Parent() event: Event) {
    const { organizationId } = event;
    return this.organizerService.getOrganizationById(organizationId);
  }

  @ResolveField()
  location(@Parent() event: Event) {
    const { locationId } = event;
    if (!locationId) return null;
    return this.participantService.getLocationById(locationId);
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Attendance)
  async attendance(@CurrentUser() currentUser: User, @Parent() event: Event) {
    const eventId = event.id;
    const userId = currentUser.id;
    try {
      const attendance = (await this.participantService.getUserEvent(userId, eventId).toPromise());
      return attendance;
    } catch (error) {
      return null;
    }
  }

  @ResolveField(() => Int)
  attendeeCount(@Parent() event: Event) {
    const { id } = event;
    return this.participantService.getUsersByEventId(id, UserEvent_Status.APPROVED).pipe(map(users => users.length))
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => [Attendance])
  attendees(@CurrentUser() currentUser: User, @Parent() event: Event) {
    return this.participantService.getUserEventsByEventId(event.id);
  }

  @ResolveField()
  tags(@Parent() event: Event) {
    const { id } = event;
    return this.participantService.getEventTags(id);
  }

  @ResolveField()
  durations(@Parent() event: Event) {
    const { id } = event;
    return this.participantService.getEventDurationsByEventId(id);
  }

  @ResolveField()
  questionGroups(@Parent() event: Event, @Args('type', { type: () => PickedQuestionGroupType }) type: number) {
    const { id } = event;
    return this.participantService.getQuestionGroupsByEventId(id).pipe(
      map((questionGroups) => {
        return questionGroups.filter((group) => group.type === type).sort((a, b) => a.seq - b.seq);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  setEventQuestions(@CurrentUser() currentUser: User, @Args('input') input: SetEventQuestionsInput) {
    return this.organizerService.setEventQuestions(currentUser.id, input.eventId, input.questionGroups);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Event)
  createEvent(@CurrentUser() currentUser: User, @Args('input') input: CreateEventInput) {
    const tags = input.tags?.map((tag) => tag.id);
    return this.organizerService
      .createEvent(currentUser.id, merge(new Event(), input))
      .pipe(tap((createdEvent) => tags && this.organizerService.setEventTags(currentUser.id, createdEvent.id, tags)));
  }
}
