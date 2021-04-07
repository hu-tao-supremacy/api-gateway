import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';

@InputType('OrganizationInput')
@ObjectType()
@Entity()
export class Organization {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field((_) => Boolean)
  @Column()
  isVerified: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  abbreviation?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  advisor?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  associatedFaculty?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  facebookPage?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  instagram?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lineOfficialAccount?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactFullName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactEmail?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactPhoneNumber?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactLineId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePictureHash?: string;

  @Field((_) => [Event])
  events: Event[];
}
