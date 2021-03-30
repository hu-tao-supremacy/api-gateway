import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./question.entity";
import { UserEvent } from "./user-event.entity";

@Index(["userEventId", "questionId"], { unique: true })
@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEventId: number;

  @Column()
  questionId: number;

  @Column()
  value: string;

  @ManyToOne(() => UserEvent, { onDelete: "CASCADE" })
  userEvent: UserEvent;

  @ManyToOne(() => Question, { onDelete: "CASCADE" })
  question: Question;
}
