import { BaseAdapter } from '@adapters/base.adapter';
import { Tag as TagIF } from '@interchange-formats/common/common';
import { Tag } from '@entities/tag.entity';

export class TagAdapter extends BaseAdapter<TagIF, Tag> {
  optionalFields = [];
}
