import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@InputType('EventDurationInput')
@ObjectType()
@Index(['eventId', 'start', 'finish'], { unique: true })
@Entity()
export class EventDuration {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  eventId: number;

  @Field()
  @Column('timestamptz')
  start: string;

  @Field()
  @Column('timestamptz')
  finish: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  event: Event;
}
