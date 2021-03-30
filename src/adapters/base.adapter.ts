import { mapKeys, mapValues } from 'lodash';
import long from 'long';

export class BaseAdapter<IF extends object, E extends object> {
  optionalFields: string[];

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

      if (long.isLong(a)) {
        a = Number(a.toString());
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
