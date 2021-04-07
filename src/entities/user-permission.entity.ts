import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrganization } from './user-organization.entity';

@InputType('UserPermissionInput')
@ObjectType()
@Index(['userOrganizationId', 'permissionName'], { unique: true })
@Entity()
export class UserPermission {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  userOrganizationId: number;

  @Field((_) => UserOrganization)
  @ManyToOne(() => UserOrganization, { onDelete: 'CASCADE' })
  userOrganization: UserOrganization;

  @Field()
  @Column()
  permissionName: string;
}
