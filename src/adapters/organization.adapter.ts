import { BaseAdapter } from '@adapters/base.adapter';
import { Organization as OrganizationIF } from '@interchange-formats/common/common';
import { Organization } from '@entities/organization.entity';

export class OrganizationAdapter extends BaseAdapter<
  OrganizationIF,
  Organization
> {
  optionalFields: [
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
