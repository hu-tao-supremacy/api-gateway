import { BaseAdapter } from '@onepass/adapters';
import { Tag as TagIF } from '@onepass/api/common/common';
import { Tag } from '@onepass/entities';

export class TagAdapter extends BaseAdapter<TagIF, Tag> {
  optionalFields = [];
}
