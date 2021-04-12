import { Field, ObjectType } from '@nestjs/graphql'
import { Answer } from './answer.entity';
import { Attendance } from './user-event.entity';
import { User } from './user.entity'

@ObjectType()
export class AttendanceContext {
    @Field(() => User)
    user: User;

    @Field(() => Attendance)
    attendance: Attendance;

    @Field(() => [Answer])
    answers: Answer[]
}