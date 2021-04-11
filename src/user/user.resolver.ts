import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { PickedQuestionGroupType, User, UserEvent } from '@onepass/entities';
import { BadRequestException, InternalServerErrorException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AccountService } from '@onepass/account/account.service';
import {
  CreateJoinRequestInput,
  DeleteJoinRequestInput,
  SetUserInterestsInput,
  UpdateUserInput,
} from '@onepass/inputs/user.input';
import { merge } from 'lodash';
import { ParticipantService } from '@onepass/participant/participant.service';
import { FileService } from 'src/file/file.service';
import { encode } from 'js-base64';
import { nanoid } from 'nanoid';
import { catchError, switchMap, tap, map } from 'rxjs/operators';

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
  setUserInterests(@CurrentUser() currentUser: User, @Args('input') input: SetUserInterestsInput) {
    return this.accountService.setUserInterests(currentUser.id, input.tags);
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  events(@CurrentUser() currentUser: User, @Parent() user: User) {
    if (currentUser.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.participantService.getEventsByUserId(currentUser.id);
  }

  @ResolveField()
  profilePictureUrl(@Parent() user: User) {
    if (user.profilePictureUrl) {
      return this.fileService.getSignedUrl(user.profilePictureUrl);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  createJoinRequest(@CurrentUser() currentUser: User, @Args('input') input: CreateJoinRequestInput) {
    return this.participantService.createJoinRequest(currentUser.id, input.eventId).pipe(
      catchError((error) => {
        console.log(error);
        throw new BadRequestException();
      }),
      map((userEvent) => userEvent.id),
      switchMap((userEventId) =>
        this.participantService.submitAnswers(userEventId, input.answers, PickedQuestionGroupType.PRE_EVENT),
      ),
      catchError(async (error) => {
        console.log(error);
        await this.participantService.deleteJoinRequest(currentUser.id, input.eventId).toPromise();
        throw new InternalServerErrorException()
      }),
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
