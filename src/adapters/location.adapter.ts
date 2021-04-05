import { BaseAdapter } from '@onepass/adapters';
import { Location as LocationIF } from '@onepass/api/common/common';
import { Location } from '@onepass/entities';

export class LocationAdapter extends BaseAdapter<LocationIF, Location> {
  optionalFields = ['description', 'travelInformationImageUrl', 'travelInformationImageHash'];
}
