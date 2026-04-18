import { Injectable, Inject } from '@nestjs/common';
import { Quote } from '../../../domain/quote/entities/quote.entity';
import { QuoteRepositoryPort } from '../../../domain/quote/ports/quote.repository.port';

@Injectable()
export class CreateQuoteUseCase {
  constructor(
    @Inject('QuoteRepositoryPort')
    private readonly quoteRepo: QuoteRepositoryPort,
  ) {}

  async execute(): Promise<Quote> {
    const year = new Date().getFullYear();
    const lastNumber = await this.quoteRepo.getLastFolioOfYear(year);
    const folioNumber = `COT-${year}-${String(lastNumber + 1).padStart(5, '0')}`;

    const quote = Quote.create(folioNumber);
    return this.quoteRepo.create(quote);
  }
}
