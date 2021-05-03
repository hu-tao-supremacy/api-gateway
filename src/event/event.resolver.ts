import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserEvent, Event, PickedQuestionGroupType, PickedUserEventStatus, User, Location } from '@onepass/entities';
import { EventService } from './event.service';
import { OrganizerService } from '@onepass/organizer/organizer.service';
import { ParticipantService } from '@onepass/participant/participant.service';
import { DateTime } from 'luxon';
import { tap, map, switchMap } from 'rxjs/operators';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import {
  CheckInInput,
  CreateEventInput,
  ReviewJoinRequestInput,
  SetEventDurationsInput,
  SetEventQuestionsInput,
  UpdateEventInput,
} from '@onepass/inputs/event.input';
import { merge, flatten, sampleSize, take } from 'lodash';
import { Permission, UserEvent_Status } from '@onepass/graphql/common/common';
import { forkJoin, Observable, of } from 'rxjs';
import { catchGrpcException } from 'src/operators/catch-exceptions.operator';
import { FileService } from 'src/file/file.service';
import { encode } from 'js-base64';
import { nanoid } from 'nanoid';
import { AccountService } from '@onepass/account/account.service';
import { PersonalizationService } from '@onepass/personalization/personalization.service';
import { GoogleService } from 'src/google/google.service';

@Resolver((_) => Event)
export class EventResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly participantService: ParticipantService,
    private readonly organizerService: OrganizerService,
    private readonly googleService: GoogleService,
    private readonly fileService: FileService,
    private readonly personalizationService: PersonalizationService,
  ) {}

  @Query((_) => [Event])
  async upcomingEvents(@Args('n', { type: () => Int }) n: number) {
    return this.participantService
      .getUpcomingEvents(DateTime.now().startOf('day').toISO(), DateTime.now().plus({ days: 14 }).endOf('day').toISO())
      .pipe(map((events) => sampleSize(events, n)));
  }

  @Query((_) => [Event])
  featuredEvents(@Args('n', { type: () => Int }) n: number): Observable<Event[]> {
    return this.organizerService.getOrganizations().pipe(
      map((organizations) => sampleSize(organizations, 5)),
      switchMap((sampledOrgs) =>
        forkJoin(sampledOrgs.map((org) => this.participantService.getEventsByOrganizationId(org.id))),
      ),
      map((events) => flatten(events)),
      map((events) => sampleSize(events, n)),
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => [Event])
  async recommendedEvents(@CurrentUser() user: User, @Args('n', { type: () => Int }) n: number) {
    return this.personalizationService.getRecommendedEvents(user.id, n);
  }

  @Query(() => [Event])
  async onlineEvents(@Args('n', { type: () => Int }) n: number) {
    return this.participantService.getOnlineEvents().pipe(map((events) => take(events, n)));
  }

  @Query(() => [Event])
  async pastEvents(@Args('tagIds', { type: () => [Int] }) tagIds: number[], @Args('n', { type: () => Int }) n: number) {
    return this.participantService.getPastEventsFromTags(tagIds, n);
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

  @ResolveField(() => UserEvent, { nullable: true })
  async attendance(@CurrentUser() currentUser: User, @Parent() event: Event) {
    if (!currentUser) return null;

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
    return this.accountService
      .hasPermission(currentUser.id, event.organizationId, Permission.EVENT_UPDATE)
      .pipe(switchMap((_) => this.participantService.getUserEventsByEventId(event.id)));
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
  @Mutation(() => Boolean)
  setEventDurations(@CurrentUser() currentUser: User, @Args('input') input: SetEventDurationsInput) {
    return this.organizerService.setEventDurations(currentUser.id, input.eventId, input.durations);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Event)
  createEvent(@CurrentUser() currentUser: User, @Args('input') input: CreateEventInput) {
    const location = input.location;
    const durations = input.durations;
    const tags = input.tags?.map((tag) => tag.id);
    return this.organizerService.createEvent(currentUser.id, merge(new Event(), input)).pipe(
      catchGrpcException(),
      switchMap((createdEvent) => {
        return forkJoin([
          of(createdEvent),
          tags
            ? this.organizerService.setEventTags(currentUser.id, createdEvent.id, tags).pipe(catchGrpcException())
            : of<number[]>([]),
          this.fileService.upload(`events/${encode(`${createdEvent.id}`)}/posters/${nanoid()}`, input.posterImage),
          this.fileService.upload(`events/${encode(`${createdEvent.id}`)}/covers/${nanoid()}`, input.coverImage),
          location
            ? this.organizerService
                .setEventLocation(currentUser.id, merge(new Location(), location))
                .pipe(map((loc) => loc.id))
            : of<number>(null),
          durations ? this.setEventDurations(currentUser, { eventId: createdEvent.id, durations }) : of<number[]>([]),
        ]);
      }),
      switchMap(([createdEvent, _, posterImage, coverImage, locationId]) => {
        createdEvent.posterImageUrl = posterImage?.fileURI;
        createdEvent.posterImageHash = posterImage?.hash;
        createdEvent.coverImageUrl = coverImage?.fileURI;
        createdEvent.coverImageHash = coverImage?.hash;
        createdEvent.locationId = locationId;
        return this.organizerService.updateEvent(currentUser.id, createdEvent).pipe(catchGrpcException());
      }),
      tap((createdEvent) => this.googleService.generateVectorRepresentation(createdEvent.id)),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Event)
  updateEvent(@CurrentUser() currentUser: User, @Args('input') input: UpdateEventInput) {
    const location = input.location;
    const durations = input.durations;
    const tags = input.tags?.map((tag) => tag.id);

    console.log(location);

    return this.participantService.getEventById(input.id).pipe(
      catchGrpcException(),
      switchMap((event) => {
        return this.organizerService.updateEvent(currentUser.id, merge(event, input)).pipe(catchGrpcException());
      }),
      switchMap((createdEvent) => {
        return forkJoin([
          of(createdEvent),
          tags
            ? of<number[]>([])
            : this.organizerService.setEventTags(currentUser.id, createdEvent.id, tags).pipe(catchGrpcException()),
          this.fileService.upload(`events/${encode(`${createdEvent.id}`)}/posters/${nanoid()}`, input.posterImage),
          this.fileService.upload(`events/${encode(`${createdEvent.id}`)}/covers/${nanoid()}`, input.coverImage),
          location
            ? of<number>(null)
            : this.organizerService.setEventLocation(currentUser.id, location).pipe(map((loc) => loc.id)),
          durations ? this.setEventDurations(currentUser, { eventId: createdEvent.id, durations }) : of<number[]>([]),
        ]);
      }),
      switchMap(([updatedEvent, _, posterImage, coverImage, locationId]) => {
        if (posterImage || coverImage) {
          updatedEvent.posterImageUrl = posterImage?.fileURI;
          updatedEvent.posterImageHash = posterImage?.hash;
          updatedEvent.coverImageUrl = coverImage?.fileURI;
          updatedEvent.coverImageHash = coverImage?.hash;
          updatedEvent.locationId = locationId;
          return this.organizerService.updateEvent(currentUser.id, updatedEvent);
        }

        return of(updatedEvent);
      }),
      tap((updatedEvent) => this.googleService.generateVectorRepresentation(updatedEvent.id)),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserEvent)
  reviewJoinRequest(@CurrentUser() currentUser: User, @Args('input') input: ReviewJoinRequestInput) {
    return this.organizerService.reviewJoinRequest(currentUser.id, input.userId, input.eventId, input.status);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserEvent)
  checkIn(@CurrentUser() currentUser: User, @Args('input') input: CheckInInput) {
    return this.organizerService.checkIn(currentUser.id, input.ticket, input.eventId);
  }

  @Mutation(() => Boolean)
  generateVectorRepresentation(@Args('eventId', { type: () => Int }) eventId: number) {
    this.googleService.generateVectorRepresentation(eventId);
    return true;
  }
}
