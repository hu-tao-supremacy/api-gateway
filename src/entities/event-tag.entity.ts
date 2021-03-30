import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./event.entity";
import { Tag } from "./tag.entity";

@Index(["eventId", "tagId"], { unique: true })
@Entity()
export class EventTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number;

  @Column()
  tagId: number;

  @ManyToOne(() => Event, { onDelete: "CASCADE" })
  event: Event;

  @ManyToOne(() => Tag, { onDelete: "CASCADE" })
  tag: Tag;
}
