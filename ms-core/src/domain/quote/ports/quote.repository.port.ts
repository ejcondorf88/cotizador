import { Quote } from '../entities/quote.entity';
import { QuoteStatus } from '../enums/quote-status.enum';

export const QUOTE_REPOSITORY_PORT = Symbol('QuoteRepositoryPort');

export interface QuoteRepositoryPort {
  create(quote: Quote): Promise<Quote>;
  createWithFolioNumber(year: number): Promise<Quote>;
  findById(id: string): Promise<Quote | null>;
  findAll(): Promise<Quote[]>;
  findByStatus(status: QuoteStatus): Promise<Quote[]>;
  update(id: string, data: Partial<Quote>): Promise<Quote>;
  getLastFolioOfYear(year: number): Promise<number>;
}
