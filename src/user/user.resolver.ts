import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { User } from '@onepass/entities';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AccountService } from '@onepass/account/account.service';
import { UpdateUserInput } from '@onepass/inputs/user.input';
import { merge } from 'lodash';
import { ParticipantService } from '@onepass/participant/participant.service';
import { FileService } from 'src/file/file.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly participantService: ParticipantService,
    private readonly fileService: FileService
  ) { }

  @UseGuards(AuthGuard)
  @Query(() => User)
  currentUser(@CurrentUser() user: User) {
    return this.accountService.getUserById(user.id);
  }

  @UseGuards(AuthGuard)
  @Mutation((_) => User)
  updateUser(@CurrentUser() currentUser: User, @Args('input') input: UpdateUserInput) {
    const user = new User();
    merge(user, input);
    user.id = currentUser.id;
    return this.accountService.updateAccountInfo(user);
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
      return this.fileService.getSignedUrl(user.profilePictureUrl)
    }
  }
}
