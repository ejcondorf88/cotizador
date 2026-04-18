import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateQuoteUseCase } from '../../application/quote/use-cases/create-quote.use-case';
import { QuoteMapper } from '../../infrastructure/quote/mappers/quote.mapper';
import { QuoteResponseDto } from '../../application/quote/dto/quote-response.dto';
import { StructuredLogger } from '../../common/logger/logger.service';

@Controller('quotes')
export class QuoteController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly logger: StructuredLogger,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(): Promise<QuoteResponseDto> {
    this.logger.info(
      'presentation',
      'QuoteController',
      'QUOTE_CREATE_REQUEST',
      'Received request to create quote',
    );

    try {
      const quote = await this.createQuoteUseCase.execute();

      this.logger.info(
        'presentation',
        'QuoteController',
        'QUOTE_CREATE_SUCCESS',
        'Quote created successfully',
        {
          quoteId: quote.id,
          folioNumber: quote.folioNumber,
          status: quote.status,
        },
      );

      return QuoteMapper.toResponseDto(quote);
    } catch (error) {
      this.logger.error(
        'presentation',
        'QuoteController',
        'QUOTE_CREATE_ERROR',
        'Failed to create quote',
        error as Error,
      );
      throw error;
    }
  }
}
