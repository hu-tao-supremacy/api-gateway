import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event.entity";

@Index(["eventId", "start", "finish"], { unique: true })
@Entity()
export class EventDuration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number;

  @Column("timestamptz")
  start: string;

  @Column("timestamptz")
  finish: string;

  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  event: Event;
}
