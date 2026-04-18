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
    // Use atomic creation with transaction to prevent race conditions
    return this.quoteRepo.createWithFolioNumber(year);
  }
}
