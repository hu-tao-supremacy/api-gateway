import { UserEvent_Status as Status } from '@onepass/graphql/common/common';
import { Field, InputType, Int, IntersectionType, ObjectType, OmitType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { User } from './user.entity';
import { pick } from 'lodash';

const PickedStatus = pick(Status, ['APPROVED', 'REJECTED', 'PENDING']);
registerEnumType(PickedStatus, { name: 'UserEventStatus' });

@InputType('UserEventInput')
@ObjectType()
@Index(['userId', 'eventId'], { unique: true })
@Index(['eventId', 'ticket'], { unique: true })
@Entity()
export class UserEvent {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  userId: number;

  @Field((_) => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Field((_) => Int)
  @Column()
  eventId: number;

  @Field((_) => Event)
  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  event: Event;

  @Field((_) => Int, { nullable: true })
  @Column({ nullable: true })
  rating?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ticket?: string;

  @Field((_) => PickedStatus)
  @Column('enum', { enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  status: string;
}

@InputType('AttendanceInput')
@ObjectType()
export class Attendance extends UserEvent {}
