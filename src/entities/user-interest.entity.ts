import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tag } from "./tag.entity";
import { User } from "./user.entity";

@Index(["userId", "tagId"], { unique: true })
@Entity()
export class UserInterest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column()
  tagId: number;

  @ManyToOne(() => Tag, { onDelete: "CASCADE" })
  tag: Tag;
}
