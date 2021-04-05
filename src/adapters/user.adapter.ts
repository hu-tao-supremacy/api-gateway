import { BaseAdapter } from '@onepass/adapters';
import { User as UserIF } from '@onepass/api/common/common';
import { User as User } from '@onepass/entities';

export class UserAdapter extends BaseAdapter<UserIF, User> {
  optionalFields = ['chulaId', 'address', 'profilePictureUrl', 'nickname'];
}
