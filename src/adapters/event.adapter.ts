import { BaseAdapter } from '@adapters/base.adapter';
import { Event as EventIF } from '@interchange-formats/common/common';
import { Event } from '@entities/event.entity';

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
