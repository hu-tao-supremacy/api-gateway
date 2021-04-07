import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { UserEvent } from './user-event.entity';

@InputType('AnswerInput')
@ObjectType()
@Index(['userEventId', 'questionId'], { unique: true })
@Entity()
export class Answer {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  userEventId: number;

  @Field((_) => Int)
  @Column()
  questionId: number;

  @Field()
  @Column()
  value: string;

  @ManyToOne(() => UserEvent, { onDelete: 'CASCADE' })
  userEvent: UserEvent;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;
}
