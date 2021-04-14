import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserEvent, Event, PickedQuestionGroupType, PickedUserEventStatus, User } from '@onepass/entities';
import { EventService } from './event.service';
import { OrganizerService } from '@onepass/organizer/organizer.service';
import { ParticipantService } from '@onepass/participant/participant.service';
import { DateTime } from 'luxon';
import { map, switchMap, tap } from 'rxjs/operators';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CreateEventInput, SetEventQuestionsInput, UpdateEventInput } from '@onepass/inputs/event.input';
import { merge } from 'lodash';
import { UserEvent_Status } from '@onepass/graphql/common/common';
import { forkJoin, of } from 'rxjs';
import { catchGrpcException } from 'src/operators/catch-exceptions.operator';
import { FileService } from 'src/file/file.service';
import { encode } from 'js-base64';
import { nanoid } from 'nanoid';

@Resolver((_) => Event)
export class EventResolver {
  constructor(
    private readonly participantService: ParticipantService,
    private readonly organizerService: OrganizerService,
    private readonly eventService: EventService,
    private readonly fileService: FileService,
  ) {}

  @Query((_) => [Event])
  async upcomingEvents() {
    return this.participantService.getUpcomingEvents(
      DateTime.now().startOf('day').toISO(),
      DateTime.now().plus({ days: 14 }).endOf('day').toISO(),
    );
  }

  @ResolveField()
  coverImageUrl(@Parent() event: Event) {
    if (event.coverImageUrl) {
      return this.fileService.getSignedUrl(event.coverImageUrl);
    }
  }

  @ResolveField()
  posterImageUrl(@Parent() event: Event) {
    if (event.posterImageUrl) {
      return this.fileService.getSignedUrl(event.posterImageUrl);
    }
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
  @ResolveField(() => UserEvent, { nullable: true })
  async attendance(@CurrentUser() currentUser: User, @Parent() event: Event) {
    const eventId = event.id;
    const userId = currentUser.id;
    try {
      const attendance = await this.participantService.getUserEvent(userId, eventId).toPromise();
      return attendance;
    } catch (error) {
      return null;
    }
  }

  @ResolveField(() => Int)
  attendeeCount(@Parent() event: Event) {
    const { id } = event;
    return this.participantService.getUsersByEventId(id, UserEvent_Status.APPROVED).pipe(map((users) => users.length));
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => [UserEvent])
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
    return this.organizerService.createEvent(currentUser.id, merge(new Event(), input)).pipe(
      catchGrpcException(),
      switchMap((createdEvent) => {
        return forkJoin([
          of(createdEvent),
          tags
            ? of<number[]>([])
            : this.organizerService.setEventTags(currentUser.id, createdEvent.id, tags).pipe(catchGrpcException()),
          this.fileService.upload(`events/${encode(`${createdEvent.id}`)}/posters/${nanoid()}`, input.posterImage),
          this.fileService.upload(`events/${encode(`${createdEvent.id}`)}/covers/${nanoid()}`, input.coverImage),
        ]);
      }),
      switchMap(([createdEvent, _, posterImageURI, coverImageURI]) => {
        createdEvent.posterImageUrl = posterImageURI;
        createdEvent.coverImageUrl = coverImageURI;
        return this.organizerService.updateEvent(currentUser.id, createdEvent).pipe(catchGrpcException());
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Event)
  updateEvent(@CurrentUser() currentUser: User, @Args('input') input: UpdateEventInput) {
    return this.organizerService.updateEvent(currentUser.id, merge(new Event(), input)).pipe(
      catchGrpcException(),
      switchMap((updatedEvent) => {
        return forkJoin([
          of(updatedEvent),
          this.fileService.upload(`events/${encode(`${updatedEvent.id}`)}/posters/${nanoid()}`, input.posterImage),
          this.fileService.upload(`events/${encode(`${updatedEvent.id}`)}/covers/${nanoid()}`, input.coverImage),
        ]);
      }),
      switchMap(([updatedEvent, posterImageURI, coverImageURI]) => {
        if (posterImageURI || coverImageURI) {
          updatedEvent.posterImageUrl = posterImageURI;
          updatedEvent.coverImageUrl = coverImageURI;
          return this.organizerService.updateEvent(currentUser.id, updatedEvent);
        }

        return of(updatedEvent);
      }),
    );
  }
}
