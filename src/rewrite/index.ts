import * as common from '../apis/hts/common/common';
import { StringValue } from '../apis/google/protobuf/wrappers';
import { Weaken } from './utils';

export interface User extends Weaken<common.User, 'nickname', 'chulaId'> {
  nickname: StringValue;
  chulaId: StringValue;
}
