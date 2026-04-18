import { v4 as uuid } from 'uuid';
import { QuoteStatus } from '../enums/quote-status.enum';

export class Quote {
  constructor(
    public readonly id: string,
    public readonly folioNumber: string,
    public status: QuoteStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
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
}
