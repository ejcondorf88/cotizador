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
}
