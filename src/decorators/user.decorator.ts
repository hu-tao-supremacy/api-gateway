import { createParamDecorator } from '@nestjs/common'
import { User } from '@entities/user.entity'
import { Request } from 'express'

export const CurrentUser = createParamDecorator((data, req: Request): User => {
    return req.user
})