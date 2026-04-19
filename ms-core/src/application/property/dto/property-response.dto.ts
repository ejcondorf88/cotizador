import { ConstructionType } from '../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../domain/property/enums/property-usage.enum';
import { PropertyStatus } from '../../../domain/property/enums/property-status.enum';

export interface PropertyAddressResponse {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ConstructionDetailsResponse {
  type: ConstructionType;
  year?: number;
  levels?: number;
  usage: PropertyUsage;
  specificActivity: string;
  activityCode?: string;
}

export interface PropertyCoveragesResponse {
  building: number;
  contents: number;
  electronicEquipment: number;
  machinery: number;
  stock: number;
}

export class PropertyResponseDto {
  id: string;
  quoteId: string;
  name: string;
  address: PropertyAddressResponse;
  construction: ConstructionDetailsResponse;
  coverages: PropertyCoveragesResponse;
  status: PropertyStatus;
  completionPercentage: number;
  totalSumInsured: number;
  createdAt: string;
  updatedAt: string;

  constructor(property: {
    id: string;
    quoteId: string;
    name: string;
    address: { street: string; neighborhood: string; city: string; state: string; zipCode: string };
    construction: {
      type: ConstructionType;
      year?: number;
      levels?: number;
      usage: PropertyUsage;
      specificActivity: string;
      activityCode?: string;
    };
    coverages: {
      building: number;
      contents: number;
      electronicEquipment: number;
      machinery: number;
      stock: number;
    };
    status: PropertyStatus;
    completionPercentage: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = property.id;
    this.quoteId = property.quoteId;
    this.name = property.name;
    this.address = property.address;
    this.construction = property.construction;
    this.coverages = property.coverages;
    this.status = property.status;
    this.completionPercentage = property.completionPercentage;
    this.totalSumInsured = Object.values(property.coverages).reduce((a, b) => a + (b || 0), 0);
    this.createdAt = property.createdAt.toISOString();
    this.updatedAt = property.updatedAt.toISOString();
  }
}

export class PropertiesListResponseDto {
  properties: PropertyResponseDto[];
  total: number;
  completed: number;
  totalSumInsured: number;

  constructor(properties: PropertyResponseDto[]) {
    this.properties = properties;
    this.total = properties.length;
    this.completed = properties.filter((p) => p.status === 'COMPLETE').length;
    this.totalSumInsured = properties.reduce((sum, p) => sum + p.totalSumInsured, 0);
  }
}
