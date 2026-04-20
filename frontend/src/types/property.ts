export const ConstructionType = {
  CONCRETO: 'CONCRETO',
  ACERO: 'ACERO',
  MAMPOSTERIA: 'MAMPOSTERIA',
  MADERA: 'MADERA',
  OTRO: 'OTRO',
} as const;

export type ConstructionType = (typeof ConstructionType)[keyof typeof ConstructionType];

export const PropertyUsage = {
  COMERCIAL: 'COMERCIAL',
  INDUSTRIAL: 'INDUSTRIAL',
  OFICINA: 'OFICINA',
  RESIDENCIAL: 'RESIDENCIAL',
  MIXTO: 'MIXTO',
} as const;

export type PropertyUsage = (typeof PropertyUsage)[keyof typeof PropertyUsage];

export const PropertyStatus = {
  INCOMPLETE: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
} as const;

export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus];

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

export const PropertyStatusLabels: Record<PropertyStatus, string> = {
  [PropertyStatus.INCOMPLETE]: 'Incompleta',
  [PropertyStatus.COMPLETE]: 'Completa',
};

// ========== UBICACIÓN ==========
export interface PropertyAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// ========== CONSTRUCCIÓN ==========
export interface ConstructionDetails {
  type: ConstructionType;
  year?: number;
  levels?: number;
  usage: PropertyUsage;
  specificActivity: string;
  activityCode?: string;
}

// ========== GARANTÍAS ==========
export interface PropertyCoverages {
  building: number;
  contents: number;
  electronicEquipment: number;
  machinery: number;
  stock: number;
}

// ========== PROPIEDAD COMPLETA ==========
export interface Property {
  id: string;
  quoteId: string;
  name: string;
  address: PropertyAddress;
  construction: ConstructionDetails;
  coverages: PropertyCoverages;
  status: PropertyStatus;
  completionPercentage: number;
  totalSumInsured?: number;
  createdAt: string;
  updatedAt: string;
}

// ========== REQUESTS/RESPONSES ==========
export interface CreatePropertyRequest {
  name: string;
  address: PropertyAddress;
  construction: ConstructionDetails;
  coverages: PropertyCoverages;
}

export interface UpdatePropertyRequest {
  // Ubicación
  name?: string;
  address?: Partial<PropertyAddress>;
  // Construcción
  constructionType?: ConstructionType;
  constructionYear?: number;
  levels?: number;
  propertyUsage?: PropertyUsage;
  specificActivity?: string;
  activityCode?: string;
  // Garantías
  coverageBuilding?: number;
  coverageContents?: number;
  coverageElectronic?: number;
  coverageMachinery?: number;
  coverageStock?: number;
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
  totalSumInsured: number;
}

// ========== CATÁLOGOS ==========
export interface ActivityOption {
  code: string;
  description: string;
}
