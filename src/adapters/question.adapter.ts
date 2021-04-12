import { BaseAdapter } from '@onepass/adapters';
import { Question as QuestionIF } from '@onepass/api/common/common';
import { Question } from '@onepass/entities';

export class QuestionAdapter extends BaseAdapter<QuestionIF, Question> {
  booleanFields = ['isOptional'];
}
