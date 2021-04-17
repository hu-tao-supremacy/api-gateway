import { Gender, Permission } from '@onepass/graphql/common/common';
import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { pick } from 'lodash';
import { PrimaryGeneratedColumn, Column, Entity, Index } from 'typeorm';
import { Event } from './event.entity';
import { Organization } from './organization.entity';
import { Tag } from './tag.entity';
import { UserPermission } from './user-permission.entity';
import { UserOrganization } from './user-organization.entity';
import { UserEvent } from './user-event.entity';

const PickedGender = pick(Gender, ['M', 'F', 'NS']);
registerEnumType(PickedGender, { name: 'Gender' });

@InputType('UserInput')
@ObjectType()
@Entity()
export class User {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nickname?: string;

  @Field({ nullable: true })
  @Index({ unique: true, where: 'chula_id IS NOT NULL' })
  @Column({ nullable: true })
  chulaId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  district?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  province?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  zipCode?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Field((_) => Boolean)
  @Column()
  isChulaStudent: boolean;

  @Field((_) => Boolean)
  @Column()
  didSetup: boolean;

  @Field((_) => PickedGender)
  @Column('enum', { enum: ['M', 'F', 'NS'] })
  gender: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  academicYear?: number;

  @Field((_) => [UserOrganization])
  organizations: UserOrganization[];

  @Field((_) => [Event])
  history: Event[];

  @Field((_) => [Tag])
  interests: Tag[];
}
