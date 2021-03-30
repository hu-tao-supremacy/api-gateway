import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity()
export class Tag {
  @Field(_ => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;
}
