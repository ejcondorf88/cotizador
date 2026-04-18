import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';

export class QuoteResponseDto {
  id: string;
  folioNumber: string;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}
