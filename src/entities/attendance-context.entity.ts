import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Answer } from './answer.entity';
import { Attendance } from './user-event.entity';
import { User } from './user.entity';

@InputType('AttendanceContextInput')
@ObjectType()
export class AttendanceContext {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  attendanceId: number;

  @Field(() => Int)
  eventId: number;

  @Field(() => User)
  user: User;

  @Field(() => Attendance)
  attendance: Attendance;

  @Field(() => [Answer])
  answers: Answer[];
}
