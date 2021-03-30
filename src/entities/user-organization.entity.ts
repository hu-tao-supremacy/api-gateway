import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "./organization.entity";
import { User } from "./user.entity";

@Index(["userId", "organizationId"], { unique: true })
@Entity()
export class UserOrganization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, { onDelete: "CASCADE" })
  organization: Organization;
}
