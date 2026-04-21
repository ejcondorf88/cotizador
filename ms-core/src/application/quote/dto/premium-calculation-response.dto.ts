import { PropertyCalculationStatus } from '../../../domain/property/entities/property.entity';

export class CoverageBreakdownDto {
  coverageCode: string;
  coverageName: string;
  amount: number;
}

export class PropertyResultDto {
  propertyId: string;
  name: string;
  status: PropertyCalculationStatus;
  incompleteReason?: string;
  netPremium?: number;
  commercialPremium?: number;
  breakdown: CoverageBreakdownDto[];
}

export class PremiumCalculationResponseDto {
  folio: string;
  status: string;
  version: number;
  netPremium: number;
  commercialPremium: number;
  commercialFactor: number;
  calculatedAt: string;
  propertiesCalculated: number;
  propertiesTotal: number;
  properties: PropertyResultDto[];
  alerts: string[];
}
