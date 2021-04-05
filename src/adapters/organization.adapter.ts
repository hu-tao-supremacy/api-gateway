import { BaseAdapter } from '@onepass/adapters';
import { Organization as OrganizationIF } from '@onepass/api/common/common';
import { Organization } from '@onepass/entities';

export class OrganizationAdapter extends BaseAdapter<OrganizationIF, Organization> {
  optionalFields = [
    'abbreviation',
    'advisor',
    'associatedFaculty',
    'description',
    'facebookPage',
    'instagram',
    'lineOfficialAccount',
    'email',
    'contactFullName',
    'contactEmail',
    'contactPhoneNumber',
    'contactLineId',
    'profilePictureUrl',
    'profilePictureHash',
  ];
}
