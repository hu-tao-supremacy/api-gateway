import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { User } from '@onepass/entities';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AccountService } from '@onepass/account/account.service';
import { UpdateUserInput } from '@onepass/inputs/user.input';
import { merge } from 'lodash';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly accountService: AccountService) { }

  @UseGuards(AuthGuard)
  @Query(() => User)
  currentUser(@CurrentUser() user: User) {
    return this.accountService.getUserById(user.id)
  }

  @UseGuards(AuthGuard)
  @ResolveField()
  events(@Parent() user: User) { }

  @UseGuards(AuthGuard)
  @Mutation(_ => User)
  updateUser(@CurrentUser() currentUser: User, @Args('input') input: UpdateUserInput) {
    const user = new User()
    merge(user, input)
    user.id = currentUser.id
    return this.accountService.updateAccountInfo(user)
  }
}
