import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@InputType('TagInput')
@ObjectType()
@Entity()
export class Tag {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [Event])
  events: Event[];
}
