import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@entities/user.entity';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { ProxyAccountService } from '@hu-tao-supremacy:account/proxy-account.service';
import { UpdateUserInput } from '@inputs/user.input';
import { merge } from 'lodash';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly proxyAccountService: ProxyAccountService) { }

  @UseGuards(AuthGuard)
  @Query(() => User)
  currentUser(@CurrentUser() user: User) {
    return this.proxyAccountService.getUserById(user.id)
  }

  @UseGuards(AuthGuard)
  @Mutation(_ => User)
  updateUser(@CurrentUser() currentUser: User, @Args('input') input: UpdateUserInput) {
    const user = new User()
    merge(user, input)

    if (user.id !== currentUser.id) {
      throw new ForbiddenException();
    }

    return this.proxyAccountService.updateAccountInfo(user)
  }
}
