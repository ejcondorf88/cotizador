import { Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateQuoteUseCase } from '../../application/quote/use-cases/create-quote.use-case';
import { QuoteMapper } from '../../infrastructure/quote/mappers/quote.mapper';
import { QuoteResponseDto } from '../../application/quote/dto/quote-response.dto';

@Controller('quotes')
export class QuoteController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(): Promise<QuoteResponseDto> {
    const quote = await this.createQuoteUseCase.execute();
    return QuoteMapper.toResponseDto(quote);
  }
}
