import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { FacilityRequest_Status as Status } from '@onepass/graphql/common/common';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './event.entity';
import { Facility } from './facility.entity';

registerEnumType(Status, { name: 'FacilityRequestStatus' });

@InputType('FacilityRequestInput')
@ObjectType()
@Entity()
export class FacilityRequest {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  eventId: number;

  @Field((_) => Event)
  @ManyToOne(() => Event)
  event: Event;

  @Field((_) => Int)
  @Column()
  facilityId: number;

  @Field((_) => Facility)
  @ManyToOne(() => Facility, { onDelete: 'CASCADE' })
  facility: Facility;

  @Field((_) => Status)
  @Column('enum', { enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  status: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  rejectReason?: string;

  @Field({ nullable: true })
  @Column('timestamptz', { nullable: true })
  start: string;

  @Field({ nullable: true })
  @Column('timestamptz', { nullable: true })
  finish: string;
}
