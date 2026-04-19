import { Injectable, Inject } from '@nestjs/common';
import { Property } from '../../../domain/property/entities/property.entity';
import { PropertyRepositoryPort } from '../../../domain/property/ports/property.repository.port';
import { StructuredLogger } from '../../../common/logger/logger.service';

interface GetPropertiesByQuoteInput {
  quoteId: string;
}

@Injectable()
export class GetPropertiesByQuoteUseCase {
  constructor(
    @Inject('PropertyRepositoryPort')
    private readonly propertyRepo: PropertyRepositoryPort,
    private readonly logger: StructuredLogger,
  ) {}

  async execute(input: GetPropertiesByQuoteInput): Promise<Property[]> {
    const { quoteId } = input;

    this.logger.debug(
      'application',
      'GetPropertiesByQuoteUseCase',
      'USE_CASE_START',
      'Fetching properties by quote',
      { quoteId },
    );

    try {
      const properties = await this.propertyRepo.findByQuoteId(quoteId);

      this.logger.debug(
        'application',
        'GetPropertiesByQuoteUseCase',
        'USE_CASE_SUCCESS',
        'Properties fetched successfully',
        { quoteId, count: properties.length },
      );

      return properties;
    } catch (error) {
      this.logger.error(
        'application',
        'GetPropertiesByQuoteUseCase',
        'USE_CASE_ERROR',
        'Failed to fetch properties',
        error as Error,
        { quoteId },
      );
      throw error;
    }
  }
}
