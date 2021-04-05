import { BaseAdapter } from '@onepass/adapters';
import { Event as EventIF } from '@onepass/api/common/common';
import { Event } from '@onepass/entities';

export class EventAdapter extends BaseAdapter<EventIF, Event> {
  optionalFields = [
    'locationId',
    'coverImageUrl',
    'coverImageHash',
    'posterImageUrl',
    'posterImageHash',
    'profileImageUrl',
    'profileImageHash',
  ];
}
