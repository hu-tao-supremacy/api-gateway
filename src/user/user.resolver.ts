import { Query, Resolver } from '@nestjs/graphql';
import { User } from '@entities/user.entity';
import { NotImplementedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';

@Resolver(() => User)
export class UserResolver {
  @UseGuards(AuthGuard)
  @Query(() => User)
  currentUser(@CurrentUser() user: User) {
    throw new NotImplementedException();
  }
}
