import { Query, Resolver } from '@nestjs/graphql';
import { User } from '@entities/user.entity';
import { NotImplementedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { ProxyAccountService } from '@hu-tao-supremacy:account/proxy-account.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly proxyAccountService: ProxyAccountService) { }

  @UseGuards(AuthGuard)
  @Query(() => User)
  currentUser(@CurrentUser() user: User) {
    return this.proxyAccountService.getUserById(user.id)
  }
}
