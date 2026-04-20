import { Injectable, Inject } from '@nestjs/common';
import { Quote } from '../../../domain/quote/entities/quote.entity';
import { QuoteRepositoryPort, QUOTE_REPOSITORY_PORT } from '../../../domain/quote/ports/quote.repository.port';
import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';
import { StructuredLogger } from '../../../common/logger/logger.service';

@Injectable()
export class GetQuotesUseCase {
  constructor(
    @Inject(QUOTE_REPOSITORY_PORT)
    private readonly quoteRepo: QuoteRepositoryPort,
    private readonly logger: StructuredLogger,
  ) {}

  async execute(status?: QuoteStatus): Promise<Quote[]> {
    const startTime = Date.now();

    this.logger.info(
      'application',
      'GetQuotesUseCase',
      'USE_CASE_START',
      'Fetching quotes',
      { status },
    );

    try {
      let quotes: Quote[];

      if (status) {
        quotes = await this.quoteRepo.findByStatus(status);
      } else {
        quotes = await this.quoteRepo.findAll();
      }

      const duration = Date.now() - startTime;
      this.logger.info(
        'application',
        'GetQuotesUseCase',
        'USE_CASE_SUCCESS',
        'Quotes fetched successfully',
        { count: quotes.length, status },
        duration,
      );

      return quotes;
    } catch (error) {
      this.logger.error(
        'application',
        'GetQuotesUseCase',
        'USE_CASE_ERROR',
        'Failed to fetch quotes',
        error as Error,
        { status },
      );
      throw error;
    }
  }
}
