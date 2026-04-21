export interface CoverageBreakdown {
  coverageCode: string;
  coverageName: string;
  amount: number;
}

export interface PropertyResult {
  propertyId: string;
  name: string;
  status: 'CALCULATED' | 'INCOMPLETE';
  incompleteReason?: string;
  netPremium?: number;
  commercialPremium?: number;
  breakdown: CoverageBreakdown[];
}

export interface PremiumCalculationResult {
  folio: string;
  status: string;
  version: number;
  netPremium: number;
  commercialPremium: number;
  commercialFactor: number;
  calculatedAt: string;
  propertiesCalculated: number;
  propertiesTotal: number;
  properties: PropertyResult[];
  alerts: string[];
}
