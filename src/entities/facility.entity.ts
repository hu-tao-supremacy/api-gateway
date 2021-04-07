import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';

@InputType('FacilityInput')
@ObjectType()
@Entity()
export class Facility {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  organizationId: number;

  @Field((_) => Organization)
  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  organization: Organization;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field((_) => Float)
  @Column()
  latitude: number;

  @Field((_) => Float)
  @Column()
  longitude: number;

  @Field()
  @Column('json')
  operatingHours: string;

  @Field()
  @Column()
  description: string;
}
