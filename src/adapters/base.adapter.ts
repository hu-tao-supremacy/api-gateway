import { has, keys, mapValues } from 'lodash';
import { isLong } from 'long';
import { DateTime } from 'luxon';

export class BaseAdapter<IF extends object, E extends object> {
  optionalFields: string[] = [];

  wrapperToOptional(field: any) {
    return field?.value;
  }

  optionalToWrapper(field: any) {
    return { value: field };
  }

  toEntity(object: IF): E {
    return mapValues(object, (value, key) => {
      let a = value;

      if (this.optionalFields.includes(key)) {
        a = this.wrapperToOptional(value);
      }

      if (isLong(a)) {
        // @ts-ignore
        a = Number(a.toString());
      }

      // google.protobuf.Timestamp
      if (has(a, 'seconds') && has(a, 'nanos') && keys(a).length === 2) {
        // @ts-ignore
        a.seconds = isLong(a.seconds) ? Number(a.seconds.toString()) : a.seconds
        // @ts-ignore
        a.nanos = isLong(a.nanos) ? Number(a.nanos.toString()) : a.nanos
        // @ts-ignore
        a = DateTime.fromJSDate(new Date(a.seconds * 1000 + a.nanos / 1000)).toISO()
      }

      return a;
    }) as E;
  }

  toInterchangeFormat(object: E): IF {
    return mapValues(object, (value, key) =>
      this.optionalFields.includes(key) ? this.optionalToWrapper(value) : value,
    ) as IF;
  }
}
