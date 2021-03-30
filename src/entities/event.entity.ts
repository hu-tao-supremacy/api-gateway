import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { Organization } from './organization.entity';
import { QuestionGroup } from './question-group.entity';

@ObjectType()
@Index(['organizationId', 'name'], { unique: true })
@Entity()
export class Event {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  organization: Organization;

  @Field((_) => Int, { nullable: true })
  @Column({ nullable: true })
  locationId?: number;

  @ManyToOne(() => Location)
  location?: Location;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverImageUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverImageHash?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  posterImageUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  posterImageHash?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImageUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImageHash?: string;

  @Column()
  attendeeLimit: number;

  @Column({ nullable: true })
  contact?: string;

  @OneToMany(() => QuestionGroup, (questionGroup) => questionGroup.event)
  questionGroups: QuestionGroup[];
}
