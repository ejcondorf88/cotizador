import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PropertyRepositoryPort } from '../../../domain/property/ports/property.repository.port';
import { QuoteRepositoryPort } from '../../../domain/quote/ports/quote.repository.port';
import { StructuredLogger } from '../../../common/logger/logger.service';

interface DeletePropertiesByQuoteInput {
  quoteId: string;
}

@Injectable()
export class DeletePropertiesByQuoteUseCase {
  constructor(
    @Inject('PropertyRepositoryPort')
    private readonly propertyRepo: PropertyRepositoryPort,
    @Inject('QuoteRepositoryPort')
    private readonly quoteRepo: QuoteRepositoryPort,
    private readonly logger: StructuredLogger,
  ) {}

  async execute(input: DeletePropertiesByQuoteInput): Promise<void> {
    const { quoteId } = input;

    this.logger.info(
      'application',
      'DeletePropertiesByQuoteUseCase',
      'USE_CASE_START',
      'Deleting properties by quote',
      { quoteId },
    );

    try {
      // Validate quote exists
      const quote = await this.quoteRepo.findById(quoteId);
      if (!quote) {
        this.logger.warn(
          'application',
          'DeletePropertiesByQuoteUseCase',
          'QUOTE_NOT_FOUND',
          'Quote not found',
          { quoteId },
        );
        throw new NotFoundException(`Quote with id ${quoteId} not found`);
      }

      // Delete all properties
      await this.propertyRepo.deleteByQuoteId(quoteId);

      this.logger.info(
        'application',
        'DeletePropertiesByQuoteUseCase',
        'USE_CASE_SUCCESS',
        'Properties deleted successfully',
        { quoteId },
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        'application',
        'DeletePropertiesByQuoteUseCase',
        'USE_CASE_ERROR',
        'Failed to delete properties',
        error as Error,
        { quoteId },
      );
      throw error;
    }
  }
}
