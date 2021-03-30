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
      if (this.optionalFields.includes(key)) {
        value = this.wrapperToOptional(value);
      }

      if (long.isLong(value)) {
        value = Number(value);
      }

      return value;
    }) as E;
  }

  toInterchangeFormat(object: E): IF {
    return mapValues(object, (value, key) =>
      this.optionalFields.includes(key) ? this.optionalToWrapper(value) : value,
    ) as IF;
  }
}
