import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';

export class QuoteDetailsDto {
  // Asegurado
  companyName?: string;
  rfc?: string;
  businessLine?: string;
  businessType?: string;

  // Conducción
  agentKey?: string;
  agentName?: string;
  subscriber?: string;
  office?: string;

  // Vigencia
  validityStart?: Date;
  validityEnd?: Date;
  currency?: 'MXN' | 'USD';
  paymentType?: 'CONTADO' | 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
}

export class QuoteResponseDto {
  id: string;
  folioNumber: string;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
  details?: QuoteDetailsDto;
  netPremium?: number;
  commercialPremium?: number;
  commercialFactor?: number;
  calculatedAt?: Date;
  version?: number;
}
