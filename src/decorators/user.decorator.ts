import { createParamDecorator } from '@nestjs/common'
import { User } from '@entities/user.entity'
import { Request } from 'express'
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((_, ctx): User => {
    const context = GqlExecutionContext.create(ctx);
    const request = context.getContext().req as Request;
    return request.user
})