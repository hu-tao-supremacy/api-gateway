import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserOrganization } from "./user-organization.entity";

@Index(["userOrganizationId", "permissionName"], { unique: true })
@Entity()
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userOrganizationId: number;

  @ManyToOne(() => UserOrganization, { onDelete: "CASCADE" })
  userOrganization: UserOrganization;

  @Column()
  permissionName: string;
}
