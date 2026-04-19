import { ConstructionType } from '../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../domain/property/enums/property-usage.enum';

export interface PropertyAddressResponse {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export class PropertyResponseDto {
  id: string;
  quoteId: string;
  name: string;
  address: PropertyAddressResponse;
  insuredValue: number;
  constructionType: ConstructionType | null;
  usage: PropertyUsage | null;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;

  constructor(property: {
    id: string;
    quoteId: string;
    name: string;
    address: { street: string; neighborhood: string; city: string; state: string; zipCode: string };
    insuredValue: number;
    constructionType: ConstructionType | null;
    usage: PropertyUsage | null;
    completionPercentage: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = property.id;
    this.quoteId = property.quoteId;
    this.name = property.name;
    this.address = property.address;
    this.insuredValue = property.insuredValue;
    this.constructionType = property.constructionType;
    this.usage = property.usage;
    this.completionPercentage = property.completionPercentage;
    this.createdAt = property.createdAt.toISOString();
    this.updatedAt = property.updatedAt.toISOString();
  }
}

export class PropertiesListResponseDto {
  properties: PropertyResponseDto[];
  total: number;
  completed: number;

  constructor(properties: PropertyResponseDto[]) {
    this.properties = properties;
    this.total = properties.length;
    this.completed = properties.filter((p) => p.completionPercentage >= 80).length;
  }
}
