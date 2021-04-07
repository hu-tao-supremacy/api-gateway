import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { Tag } from './tag.entity';

@InputType('EventTagInput')
@ObjectType()
@Index(['eventId', 'tagId'], { unique: true })
@Entity()
export class EventTag {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  eventId: number;

  @Field((_) => Int)
  @Column()
  tagId: number;

  @Field((_) => Event)
  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  event: Event;

  @Field((_) => Tag)
  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  tag: Tag;
}
