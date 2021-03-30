import { BaseAdapter } from '@adapters/base.adapter';
import { Location as LocationIF } from '@interchange-formats/common/common';
import { Location } from '@entities/location.entity';

export class LocationAdapter extends BaseAdapter<LocationIF, Location> {
  optionalFields = [
    'description',
    'travelInformationImageUrl',
    'travelInformationImageHash',
  ];
}
