import { BaseAdapter } from '@onepass/adapters';
import { QuestionGroup as QuestionGroupIF } from '@onepass/api/common/common';
import { QuestionGroup } from '@onepass/entities';

export class QuestionGroupAdapter extends BaseAdapter<QuestionGroupIF, QuestionGroup> {
  optionalFields = [];
}
