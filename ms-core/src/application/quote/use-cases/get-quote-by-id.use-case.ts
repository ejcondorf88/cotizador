import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Quote } from '../../../domain/quote/entities/quote.entity';
import { QuoteRepositoryPort, QUOTE_REPOSITORY_PORT } from '../../../domain/quote/ports/quote.repository.port';
import { StructuredLogger } from '../../../common/logger/logger.service';

@Injectable()
export class GetQuoteByIdUseCase {
  constructor(
    @Inject(QUOTE_REPOSITORY_PORT)
    private readonly quoteRepo: QuoteRepositoryPort,
    private readonly logger: StructuredLogger,
  ) {}

  async execute(id: string): Promise<Quote> {
    const startTime = Date.now();

    this.logger.info(
      'application',
      'GetQuoteByIdUseCase',
      'USE_CASE_START',
      'Fetching quote by ID',
      { quoteId: id },
    );

    try {
      const quote = await this.quoteRepo.findById(id);

      if (!quote) {
        this.logger.warn(
          'application',
          'GetQuoteByIdUseCase',
          'QUOTE_NOT_FOUND',
          'Quote not found',
          { quoteId: id },
        );
        throw new NotFoundException(`Quote with id ${id} not found`);
      }

      const duration = Date.now() - startTime;
      this.logger.info(
        'application',
        'GetQuoteByIdUseCase',
        'USE_CASE_SUCCESS',
        'Quote fetched successfully',
        { quoteId: id },
        duration,
      );

      return quote;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        'application',
        'GetQuoteByIdUseCase',
        'USE_CASE_ERROR',
        'Failed to fetch quote',
        error as Error,
        { quoteId: id },
      );
      throw error;
    }
  }
}
