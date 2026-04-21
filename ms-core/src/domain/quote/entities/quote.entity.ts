import { v4 as uuid } from 'uuid';
import { QuoteStatus } from '../enums/quote-status.enum';

export interface QuoteDetails {
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

export class Quote {
  constructor(
    public readonly id: string,
    public readonly folioNumber: string,
    public status: QuoteStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public details?: QuoteDetails,
    public propertyCount?: number,
    public netPremium?: number,
    public commercialPremium?: number,
    public commercialFactor: number = 1.2,
    public calculatedAt?: Date,
    public version: number = 1,
  ) {}

  static create(folioNumber: string): Quote {
    return new Quote(
      uuid(),
      folioNumber,
      QuoteStatus.DRAFT,
      new Date(),
      new Date(),
    );
  }

  updateDetails(details: Partial<QuoteDetails>): void {
    this.details = { ...this.details, ...details };
    this.updatedAt = new Date();
  }

  changeStatus(newStatus: QuoteStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  setPropertyCount(count: number): void {
    this.propertyCount = count;
    this.updatedAt = new Date();
  }

  setPremiumCalculation(
    netPremium: number,
    commercialPremium: number,
    commercialFactor: number = 1.2,
  ): void {
    this.netPremium = netPremium;
    this.commercialPremium = commercialPremium;
    this.commercialFactor = commercialFactor;
    this.calculatedAt = new Date();
    this.version += 1;
    this.status = QuoteStatus.CALCULATED;
    this.updatedAt = new Date();
  }
}
