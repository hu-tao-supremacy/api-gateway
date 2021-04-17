import { Args, Mutation, Query, Resolver, ResolveField, Parent, Int } from '@nestjs/graphql';
import { PickedQuestionGroupType, User } from '@onepass/entities';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AccountService } from '@onepass/account/account.service';
import { CreateJoinRequestInput, DeleteJoinRequestInput, UpdateUserInput } from '@onepass/inputs/user.input';
import { merge } from 'lodash';
import { ParticipantService } from '@onepass/participant/participant.service';
import { FileService } from 'src/file/file.service';
import { encode } from 'js-base64';
import { nanoid } from 'nanoid';
import { catchError, switchMap, tap, map } from 'rxjs/operators';
import { GrpcException } from 'src/exceptions/grpc.exception';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly participantService: ParticipantService,
    private readonly fileService: FileService,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => User)
  currentUser(@CurrentUser() user: User) {
    return this.accountService.getUserById(user.id);
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => User)
  updateUser(@CurrentUser() currentUser: User, @Args('input') input: UpdateUserInput) {
    const previousProfilePictureUrl = currentUser.profilePictureUrl;
    return this.fileService
      .upload(`users/${encode(`${currentUser.id}`)}/${nanoid()}`, input.profilePicture)
      .pipe(
        switchMap((uri) => {
          const user = new User();
          merge(user, input);
          user.id = currentUser.id;
          user.profilePictureUrl = uri;
          return this.accountService.updateAccountInfo(user);
        }),
      )
      .pipe(
        tap((_) => {
          if (previousProfilePictureUrl) this.fileService.delete(previousProfilePictureUrl);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  setInterestedTags(@CurrentUser() currentUser: User, @Args('tags', { type: () => [Int] }) tags: number[]) {
    return this.accountService.setInterestedTags(currentUser.id, tags);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  setInterestedEvents(@CurrentUser() currentUser: User, @Args('events', { type: () => [Int] }) events: number[]) {
    return this.accountService.setInterestedEvents(currentUser.id, events);
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  history(@CurrentUser() currentUser: User, @Parent() user: User) {
    if (currentUser.id !== user.id) throw new UnauthorizedException();

    return this.participantService.getEventsByUserId(currentUser.id);
  }

  @ResolveField()
  profilePictureUrl(@Parent() user: User) {
    if (user.profilePictureUrl) {
      return this.fileService.getSignedUrl(user.profilePictureUrl);
    }
  }

  @ResolveField()
  organizations(@Parent() user: User) {
    return this.accountService.getUserOrganizationsByUserId(user.id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  createJoinRequest(@CurrentUser() currentUser: User, @Args('input') input: CreateJoinRequestInput) {
    return this.participantService.createJoinRequest(currentUser.id, input.eventId).pipe(
      catchError((error) => {
        throw GrpcException.from(error).httpException;
      }),
      map((userEvent) => userEvent.id),
      switchMap((userEventId) =>
        this.participantService.submitAnswers(userEventId, input.answers, PickedQuestionGroupType.PRE_EVENT).pipe(
          catchError(async (e) => {
            const error = GrpcException.from(e);

            if (error.isAlreadyExists) throw error.httpException;

            await this.participantService.deleteJoinRequest(currentUser.id, input.eventId).toPromise();
            throw error.httpException;
          }),
        ),
      ),
      map((_) => true),
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  deleteJoinRequest(@CurrentUser() currentUser: User, @Args('input') input: DeleteJoinRequestInput) {
    return this.participantService.deleteJoinRequest(currentUser.id, input.eventId).pipe(map((_) => true));
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  user(@Args('email') email: string) {
    return this.accountService.getUserByEmail(email);
  }
}
