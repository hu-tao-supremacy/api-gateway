import { BaseAdapter } from '@onepass/adapters';
import { EventDuration as EventDurationIF } from '@onepass/api/common/common';
import { EventDuration } from '@onepass/entities';

export class EventDurationAdapter extends BaseAdapter<EventDurationIF, EventDuration> {
  optionalFields = [];
}
