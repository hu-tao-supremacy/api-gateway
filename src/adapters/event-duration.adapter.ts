import { BaseAdapter } from '@adapters/base.adapter';
import { EventDuration as EventDurationIF } from '@interchange-formats/common/common';
import { EventDuration } from '@entities/event-duration.entity';

export class EventDurationAdapter extends BaseAdapter<
  EventDurationIF,
  EventDuration
> {
  optionalFields: [];
}
