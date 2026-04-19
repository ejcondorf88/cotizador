import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Property } from '../../../domain/property/entities/property.entity';
import { PropertyRepositoryPort } from '../../../domain/property/ports/property.repository.port';
import { QuoteRepositoryPort } from '../../../domain/quote/ports/quote.repository.port';
import { StructuredLogger } from '../../../common/logger/logger.service';

interface CreatePropertiesBulkInput {
  quoteId: string;
  count: number;
}

@Injectable()
export class CreatePropertiesBulkUseCase {
  constructor(
    @Inject('PropertyRepositoryPort')
    private readonly propertyRepo: PropertyRepositoryPort,
    @Inject('QuoteRepositoryPort')
    private readonly quoteRepo: QuoteRepositoryPort,
    private readonly logger: StructuredLogger,
  ) {}

  async execute(input: CreatePropertiesBulkInput): Promise<Property[]> {
    const { quoteId, count } = input;

    this.logger.info(
      'application',
      'CreatePropertiesBulkUseCase',
      'USE_CASE_START',
      'Creating properties in bulk',
      { quoteId, count },
    );

    try {
      // Validate quote exists
      const quote = await this.quoteRepo.findById(quoteId);
      if (!quote) {
        this.logger.warn(
          'application',
          'CreatePropertiesBulkUseCase',
          'QUOTE_NOT_FOUND',
          'Quote not found',
          { quoteId },
        );
        throw new NotFoundException(`Quote with id ${quoteId} not found`);
      }

      // Validate count
      if (count < 1 || count > 100) {
        throw new BadRequestException('Count must be between 1 and 100');
      }

      // Check if properties already exist for this quote
      const existingProperties = await this.propertyRepo.findByQuoteId(quoteId);
      if (existingProperties.length > 0) {
        throw new BadRequestException(
          `Quote already has ${existingProperties.length} properties. Delete them first.`,
        );
      }

      // Create N empty properties
      const properties: Property[] = [];
      for (let i = 1; i <= count; i++) {
        const property = Property.createEmpty(quoteId, i);
        properties.push(property);
      }

      // Save all properties
      const saved = await this.propertyRepo.createBulk(properties);

      this.logger.info(
        'application',
        'CreatePropertiesBulkUseCase',
        'USE_CASE_SUCCESS',
        'Properties created successfully',
        { quoteId, count: saved.length },
      );

      return saved;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        'application',
        'CreatePropertiesBulkUseCase',
        'USE_CASE_ERROR',
        'Failed to create properties',
        error as Error,
        { quoteId, count },
      );
      throw error;
    }
  }
}
