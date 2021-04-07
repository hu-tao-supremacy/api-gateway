import { BaseAdapter } from '@onepass/adapters';
import { UserEvent as UserEventIF } from '@onepass/api/common/common';
import { UserEvent } from '@onepass/entities';

export class UserEventAdapter extends BaseAdapter<UserEventIF, UserEvent> {
  optionalFields = ['rating', 'ticket'];
}
