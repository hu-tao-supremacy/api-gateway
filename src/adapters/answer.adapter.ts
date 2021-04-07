import { BaseAdapter } from '@onepass/adapters';
import { Answer as InterchangeFormat } from '@onepass/api/common/common';
import { Answer as Entity } from '@onepass/entities';

export class AnswerAdapter extends BaseAdapter<InterchangeFormat, Entity> {
  optionalFields = [];
}
