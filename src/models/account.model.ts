import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User, Gender } from '@gql/common/common';

registerEnumType(Gender, { name: 'Gender' });

@ObjectType()
export class Account implements User {
  @Field((_) => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  nickname: string;

  @Field()
  isChulaStudent: boolean;

  @Field({ nullable: true })
  chulaId: string | undefined;

  @Field({ nullable: true })
  address: string | undefined;

  @Field({ nullable: true })
  profilePictureUrl: string | undefined;

  @Field((type) => Gender)
  gender: Gender;
}
