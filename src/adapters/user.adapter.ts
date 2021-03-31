import { BaseAdapter } from '@adapters/base.adapter';
import { User as UserIF } from '@interchange-formats/common/common';
import { User as User } from '@entities/user.entity';

export class UserAdapter extends BaseAdapter<UserIF, User> {
  optionalFields = ['chulaId', 'address', 'profilePictureUrl', 'nickname'];
}
