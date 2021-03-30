import { Gender } from "@gql/common/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PrimaryGeneratedColumn, Column, Entity, Index } from "typeorm";

@ObjectType()
@Entity()
export class User {
  @Field(_ => Int)
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
  @Index({ unique: true, where: "chula_id IS NOT NULL" })
  @Column({ nullable: true })
  chulaId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Field(_ => Boolean)
  @Column()
  isChulaStudent: boolean;

  @Field(_ => Gender)
  @Column("enum", { enum: ["M", "F", "NS"] })
  gender: string;
}
