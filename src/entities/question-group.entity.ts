import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { QuestionGroupType } from '@onepass/graphql/common/common';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { Question } from './question.entity';
import { pick } from 'lodash';

export const PickedQuestionGroupType = pick(QuestionGroupType, ['PRE_EVENT', 'POST_EVENT']);
registerEnumType(PickedQuestionGroupType, { name: 'QuestionGroupType' });

@InputType('QuestionGroupInput')
@ObjectType()
@Index(['eventId', 'type', 'seq'], { unique: true })
@Entity()
export class QuestionGroup {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  eventId: number;

  @Field((_) => Event)
  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  event: Event;

  @Field((_) => PickedQuestionGroupType)
  @Column('enum', { enum: ['PRE_EVENT', 'POST_EVENT'] })
  type: QuestionGroupType;

  @Field((_) => Int)
  @Column()
  seq: number;

  @Field()
  @Column()
  title: string;

  @Field((_) => [Question])
  @OneToMany(() => Question, (question) => question.questionGroup)
  questions: Question[];
}
