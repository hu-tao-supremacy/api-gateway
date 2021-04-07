import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType('LocationInput')
@ObjectType()
@Entity()
export class Location {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  googleMapUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  travelInformationImageUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  travelInformationImageHash?: string;
}
