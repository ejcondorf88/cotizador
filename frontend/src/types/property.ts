export enum ConstructionType {
  CONCRETO = 'CONCRETO',
  ACERO = 'ACERO',
  MAMPOSTERIA = 'MAMPOSTERIA',
  MADERA = 'MADERA',
  OTRO = 'OTRO',
}

export enum PropertyUsage {
  COMERCIAL = 'COMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  OFICINA = 'OFICINA',
  RESIDENCIAL = 'RESIDENCIAL',
  MIXTO = 'MIXTO',
}

export const ConstructionTypeLabels: Record<ConstructionType, string> = {
  [ConstructionType.CONCRETO]: 'Concreto',
  [ConstructionType.ACERO]: 'Acero',
  [ConstructionType.MAMPOSTERIA]: 'Mampostería',
  [ConstructionType.MADERA]: 'Madera',
  [ConstructionType.OTRO]: 'Otro',
};

export const PropertyUsageLabels: Record<PropertyUsage, string> = {
  [PropertyUsage.COMERCIAL]: 'Comercial',
  [PropertyUsage.INDUSTRIAL]: 'Industrial',
  [PropertyUsage.OFICINA]: 'Oficina',
  [PropertyUsage.RESIDENCIAL]: 'Residencial',
  [PropertyUsage.MIXTO]: 'Mixto',
};

export interface PropertyAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Property {
  id: string;
  quoteId: string;
  name: string;
  address: PropertyAddress;
  insuredValue: number;
  constructionType: ConstructionType | null;
  usage: PropertyUsage | null;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  name: string;
  address: PropertyAddress;
  insuredValue: number;
  constructionType: ConstructionType;
  usage: PropertyUsage;
}

export interface UpdatePropertyRequest {
  name?: string;
  address?: Partial<PropertyAddress>;
  insuredValue?: number;
  constructionType?: ConstructionType;
  usage?: PropertyUsage;
}

export interface BulkCreatePropertiesRequest {
  count: number;
}

export interface BulkCreatePropertiesResponse {
  properties: Property[];
}

export interface GetPropertiesByQuoteResponse {
  properties: Property[];
  total: number;
  completed: number;
}
