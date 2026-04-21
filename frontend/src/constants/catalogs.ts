import {
  ConstructionType,
  ConstructionTypeLabels,
  PropertyUsage,
  PropertyUsageLabels,
} from '../types/property';

export const CONSTRUCTION_TYPE_OPTIONS = Object.values(ConstructionType).map((value) => ({
  label: ConstructionTypeLabels[value],
  value,
}));

export const PROPERTY_USAGE_OPTIONS = Object.values(PropertyUsage).map((value) => ({
  label: PropertyUsageLabels[value],
  value,
}));
