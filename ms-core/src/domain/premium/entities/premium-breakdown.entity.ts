import { v4 as uuid } from 'uuid';

export interface PremiumBreakdownData {
  quoteId: string;
  propertyId: string;
  coverageCode: string;
  coverageName: string;
  amount: number;
}

export class PremiumBreakdown {
  constructor(
    public readonly id: string,
    public readonly quoteId: string,
    public readonly propertyId: string,
    public readonly coverageCode: string,
    public readonly coverageName: string,
    public readonly amount: number,
    public readonly createdAt: Date,
  ) {}

  static create(data: PremiumBreakdownData): PremiumBreakdown {
    return new PremiumBreakdown(
      uuid(),
      data.quoteId,
      data.propertyId,
      data.coverageCode,
      data.coverageName,
      data.amount,
      new Date(),
    );
  }
}
