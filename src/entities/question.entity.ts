import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AnswerType } from '@onepass/graphql/common/common';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionGroup } from './question-group.entity';
import { pick } from 'lodash';
import { Answer } from './answer.entity';

const PickedAnswerType = pick(AnswerType, ['SCALE', 'TEXT']);
registerEnumType(PickedAnswerType, { name: 'AnswerType' });

@InputType('QuestionInput')
@ObjectType()
@Index(['questionGroupId', 'seq'], { unique: true })
@Entity()
export class Question {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  questionGroupId: number;

  @ManyToOne(() => QuestionGroup, { onDelete: 'CASCADE' })
  questionGroup: QuestionGroup;

  @Field((_) => Int)
  @Column()
  seq: number;

  @Field((_) => PickedAnswerType)
  @Column('enum', { enum: ['SCALE', 'TEXT'] })
  answerType: string;

  @Field((_) => Boolean)
  @Column({ default: false })
  isOptional: boolean;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  subtitle: string;

  @Field(() => Answer)
  answer: Answer;
}
