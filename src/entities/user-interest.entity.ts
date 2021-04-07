import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@InputType('UserInterestInput')
@ObjectType()
@Index(['userId', 'tagId'], { unique: true })
@Entity()
export class UserInterest {
  @Field((_) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((_) => Int)
  @Column()
  userId: number;

  @Field((_) => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Field((_) => Int)
  @Column()
  tagId: number;

  @Field((_) => Tag)
  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  tag: Tag;
}
