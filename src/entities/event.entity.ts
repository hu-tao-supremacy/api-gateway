import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AttendanceContext } from './attendance-context.entity';
import { EventDuration } from './event-duration.entity';
import { Location } from './location.entity';
import { Organization } from './organization.entity';
import { QuestionGroup } from './question-group.entity';
import { Tag } from './tag.entity';

@InputType('EventInput')
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

  @Field((_) => Organization)
  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  organization: Organization;

  @Field((_) => Int, { nullable: true })
  @Column({ nullable: true })
  locationId?: number;

  @Field((_) => Location, { nullable: true })
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

  @Field((_) => Int)
  @Column()
  attendeeLimit: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contact?: string;

  @Field((_) => [QuestionGroup])
  @OneToMany(() => QuestionGroup, (questionGroup) => questionGroup.event)
  questionGroups: QuestionGroup[];

  @Field((_) => [EventDuration])
  @OneToMany(() => EventDuration, (duration) => duration.event)
  durations: EventDuration[];

  @Field((_) => [Tag])
  tags: Tag[];
}
