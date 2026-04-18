import { Quote } from '../entities/quote.entity';

export interface QuoteRepositoryPort {
  create(quote: Quote): Promise<Quote>;
  createWithFolioNumber(year: number): Promise<Quote>;
  findById(id: string): Promise<Quote | null>;
  findAll(): Promise<Quote[]>;
  getLastFolioOfYear(year: number): Promise<number>;
}
