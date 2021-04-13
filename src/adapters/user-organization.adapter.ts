import { BaseAdapter } from '@onepass/adapters';
import { UserOrganization as IF } from '@onepass/api/common/common';
import { UserOrganization as E } from '@onepass/entities';

export class UserOrganizationAdapter extends BaseAdapter<IF, E> {}
