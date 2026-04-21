import { Controller, Get, Post, Patch, Param, Query, Body, HttpCode, HttpStatus, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { CreateQuoteUseCase } from '../../application/quote/use-cases/create-quote.use-case';
import { GetQuotesUseCase } from '../../application/quote/use-cases/get-quotes.use-case';
import { GetQuoteByIdUseCase } from '../../application/quote/use-cases/get-quote-by-id.use-case';
import { UpdateQuoteUseCase } from '../../application/quote/use-cases/update-quote.use-case';
import { CalculatePremiumUseCase } from '../../application/quote/use-cases/calculate-premium.use-case';
import { QuoteMapper } from '../../infrastructure/quote/mappers/quote.mapper';
import { QuoteResponseDto } from '../../application/quote/dto/quote-response.dto';
import { UpdateQuoteDto } from '../../application/quote/dto/update-quote.dto';
import { QuoteFilterDto } from '../../application/quote/dto/quote-filter.dto';
import { PremiumCalculationResponseDto } from '../../application/quote/dto/premium-calculation-response.dto';
import { QuoteStatus } from '../../domain/quote/enums/quote-status.enum';
import { StructuredLogger } from '../../common/logger/logger.service';

@Controller('quotes')
export class QuoteController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly getQuotesUseCase: GetQuotesUseCase,
    private readonly getQuoteByIdUseCase: GetQuoteByIdUseCase,
    private readonly updateQuoteUseCase: UpdateQuoteUseCase,
    private readonly calculatePremiumUseCase: CalculatePremiumUseCase,
    private readonly logger: StructuredLogger,
  ) {}

  @Get()
  async findAll(@Query() filter: QuoteFilterDto): Promise<QuoteResponseDto[]> {
    this.logger.info(
      'presentation',
      'QuoteController',
      'QUOTES_LIST_REQUEST',
      'Received request to list quotes',
      { status: filter.status },
    );

    try {
      const quotes = await this.getQuotesUseCase.execute(filter.status);
      
      this.logger.info(
        'presentation',
        'QuoteController',
        'QUOTES_LIST_SUCCESS',
        'Quotes listed successfully',
        { count: quotes.length, status: filter.status },
      );

      return quotes.map(QuoteMapper.toResponseDto);
    } catch (error) {
      this.logger.error(
        'presentation',
        'QuoteController',
        'QUOTES_LIST_ERROR',
        'Failed to list quotes',
        error as Error,
        { status: filter.status },
      );
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<QuoteResponseDto> {
    this.logger.info(
      'presentation',
      'QuoteController',
      'QUOTE_GET_REQUEST',
      'Received request to get quote by ID',
      { quoteId: id },
    );

    try {
      const quote = await this.getQuoteByIdUseCase.execute(id);
      
      this.logger.info(
        'presentation',
        'QuoteController',
        'QUOTE_GET_SUCCESS',
        'Quote retrieved successfully',
        { quoteId: id },
      );

      return QuoteMapper.toResponseDto(quote);
    } catch (error) {
      this.logger.error(
        'presentation',
        'QuoteController',
        'QUOTE_GET_ERROR',
        'Failed to get quote',
        error as Error,
        { quoteId: id },
      );
      throw error;
    }
  }

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

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) dto: UpdateQuoteDto,
  ): Promise<QuoteResponseDto> {
    this.logger.info(
      'presentation',
      'QuoteController',
      'QUOTE_UPDATE_REQUEST',
      'Received request to update quote',
      { quoteId: id },
    );

    try {
      const quote = await this.updateQuoteUseCase.execute({
        id,
        companyName: dto.companyName,
        rfc: dto.rfc,
        businessLine: dto.businessLine,
        businessType: dto.businessType,
        agentKey: dto.agentKey,
        agentName: dto.agentName,
        subscriber: dto.subscriber,
        office: dto.office,
        validityStart: dto.validityStart ? new Date(dto.validityStart) : undefined,
        validityEnd: dto.validityEnd ? new Date(dto.validityEnd) : undefined,
        currency: dto.currency,
        paymentType: dto.paymentType,
        status: dto.status,
      });

      this.logger.info(
        'presentation',
        'QuoteController',
        'QUOTE_UPDATE_SUCCESS',
        'Quote updated successfully',
        {
          quoteId: quote.id,
          status: quote.status,
          hasDetails: !!quote.details,
        },
      );

      return QuoteMapper.toResponseDto(quote);
    } catch (error) {
      this.logger.error(
        'presentation',
        'QuoteController',
        'QUOTE_UPDATE_ERROR',
        'Failed to update quote',
        error as Error,
        { quoteId: id },
      );
      throw error;
    }
  }

  @Post(':id/calculate')
  @HttpCode(HttpStatus.OK)
  async calculatePremium(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PremiumCalculationResponseDto> {
    this.logger.info(
      'presentation',
      'QuoteController',
      'PREMIUM_CALCULATION_REQUEST',
      'Received request to calculate premium',
      { quoteId: id },
    );

    try {
      const result = await this.calculatePremiumUseCase.execute(id);

      this.logger.info(
        'presentation',
        'QuoteController',
        'PREMIUM_CALCULATION_SUCCESS',
        'Premium calculated successfully',
        {
          quoteId: id,
          folio: result.folio,
          netPremium: result.netPremium,
          commercialPremium: result.commercialPremium,
        },
      );

      return result;
    } catch (error) {
      this.logger.error(
        'presentation',
        'QuoteController',
        'PREMIUM_CALCULATION_ERROR',
        'Failed to calculate premium',
        error as Error,
        { quoteId: id },
      );
      throw error;
    }
  }

  @Get(':id/premium')
  async getPremiumResult(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PremiumCalculationResponseDto> {
    this.logger.info(
      'presentation',
      'QuoteController',
      'PREMIUM_RESULT_REQUEST',
      'Received request to get premium result',
      { quoteId: id },
    );

    try {
      const result = await this.calculatePremiumUseCase.getResult(id);

      this.logger.info(
        'presentation',
        'QuoteController',
        'PREMIUM_RESULT_SUCCESS',
        'Premium result retrieved successfully',
        { quoteId: id, folio: result.folio },
      );

      return result;
    } catch (error) {
      this.logger.error(
        'presentation',
        'QuoteController',
        'PREMIUM_RESULT_ERROR',
        'Failed to get premium result',
        error as Error,
        { quoteId: id },
      );
      throw error;
    }
  }
}
