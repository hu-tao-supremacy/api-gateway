import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User, Gender } from '@gql/common/common';
import { User as UserDTO } from '@internal/common/common';

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

  static from(_user: UserDTO): Account {
    const account = new Account();
    account.id = _user.id;
    account.gender = _user.gender;
    account.profilePictureUrl = _user.profilePictureUrl?.value;
    account.address = _user.address?.value;
    account.chulaId = _user.chulaId?.value;
    account.isChulaStudent = _user.isChulaStudent;
    account.nickname = _user.nickname?.value;
    account.email = _user.email;
    account.lastName = _user.lastName;
    account.firstName = _user.firstName;
    return account;
  }
}
