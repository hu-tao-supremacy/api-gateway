import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { QuestionGroupType } from "@gql/common/common";
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { Question } from "./question.entity";

registerEnumType(QuestionGroupType, { name: "QuestionGroupType" })

@ObjectType()
@Index(["eventId", "type", "seq"], { unique: true })
@Entity()
export class QuestionGroup {
  @Field(_ => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(_ => Int)
  @Column()
  eventId: number;

  @Field(_ => Event)
  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  event: Event;

  @Field(_ => QuestionGroupType)
  @Column("enum", { enum: ["PRE_EVENT", "POST_EVENT"] })
  type: string;

  @Field(_ => Int)
  @Column()
  seq: number;

  @Field()
  @Column()
  title: string;

  @Field(_ => [Question])
  @OneToMany(() => Question, (question) => question.questionGroup)
  questions: Question[];
}
