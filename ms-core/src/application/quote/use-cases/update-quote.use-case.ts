import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Quote, QuoteDetails } from '../../../domain/quote/entities/quote.entity';
import { QuoteRepositoryPort, QUOTE_REPOSITORY_PORT } from '../../../domain/quote/ports/quote.repository.port';
import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';
import { StructuredLogger } from '../../../common/logger/logger.service';

interface UpdateQuoteInput {
  id: string;
  companyName?: string;
  rfc?: string;
  businessLine?: string;
  businessType?: string;
  agentKey?: string;
  agentName?: string;
  subscriber?: string;
  office?: string;
  validityStart?: Date;
  validityEnd?: Date;
  currency?: 'MXN' | 'USD';
  paymentType?: 'CONTADO' | 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  status?: QuoteStatus;
  propertyCount?: number;
}

@Injectable()
export class UpdateQuoteUseCase {
  constructor(
    @Inject(QUOTE_REPOSITORY_PORT)
    private readonly quoteRepo: QuoteRepositoryPort,
    private readonly logger: StructuredLogger,
  ) {}

  async execute(input: UpdateQuoteInput): Promise<Quote> {
    const startTime = Date.now();
    const { id } = input;

    this.logger.info(
      'application',
      'UpdateQuoteUseCase',
      'USE_CASE_START',
      'Updating quote',
      { quoteId: id },
    );

    try {
      // Check if quote exists
      const existingQuote = await this.quoteRepo.findById(id);
      if (!existingQuote) {
        this.logger.warn(
          'application',
          'UpdateQuoteUseCase',
          'QUOTE_NOT_FOUND',
          'Quote not found for update',
          { quoteId: id },
        );
        throw new NotFoundException(`Quote with id ${id} not found`);
      }

      // Validate dates if both are provided
      if (input.validityStart && input.validityEnd) {
        if (new Date(input.validityEnd) <= new Date(input.validityStart)) {
          throw new BadRequestException('validityEnd must be after validityStart');
        }
      }

      // Build details object
      const details: Partial<QuoteDetails> = {};
      if (input.companyName !== undefined) details.companyName = input.companyName;
      if (input.rfc !== undefined) details.rfc = input.rfc;
      if (input.businessLine !== undefined) details.businessLine = input.businessLine;
      if (input.businessType !== undefined) details.businessType = input.businessType;
      if (input.agentKey !== undefined) details.agentKey = input.agentKey;
      if (input.agentName !== undefined) details.agentName = input.agentName;
      if (input.subscriber !== undefined) details.subscriber = input.subscriber;
      if (input.office !== undefined) details.office = input.office;
      if (input.validityStart !== undefined) details.validityStart = input.validityStart;
      if (input.validityEnd !== undefined) details.validityEnd = input.validityEnd;
      if (input.currency !== undefined) details.currency = input.currency;
      if (input.paymentType !== undefined) details.paymentType = input.paymentType;

    // Update the quote
    const updatedQuote = await this.quoteRepo.update(id, {
      status: input.status,
      details,
      propertyCount: input.propertyCount,
    });

      const duration = Date.now() - startTime;
      this.logger.info(
        'application',
        'UpdateQuoteUseCase',
        'USE_CASE_SUCCESS',
        'Quote updated successfully',
        { 
          quoteId: id, 
          status: updatedQuote.status,
          hasDetails: !!updatedQuote.details,
        },
        duration,
      );

      return updatedQuote;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        'application',
        'UpdateQuoteUseCase',
        'USE_CASE_ERROR',
        'Failed to update quote',
        error as Error,
        { quoteId: id },
      );
      throw error;
    }
  }
}
