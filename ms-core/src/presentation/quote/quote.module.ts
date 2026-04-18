import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteController } from './quote.controller';
import { CreateQuoteUseCase } from '../../application/quote/use-cases/create-quote.use-case';
import { GetQuotesUseCase } from '../../application/quote/use-cases/get-quotes.use-case';
import { GetQuoteByIdUseCase } from '../../application/quote/use-cases/get-quote-by-id.use-case';
import { UpdateQuoteUseCase } from '../../application/quote/use-cases/update-quote.use-case';
import { QuoteRepositoryAdapter } from '../../infrastructure/quote/adapters/quote-repository.adapter';
import { QuoteTypeOrmEntity } from '../../infrastructure/quote/entities/quote.typeorm.entity';
import { StructuredLogger } from '../../common/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuoteTypeOrmEntity])],
  controllers: [QuoteController],
  providers: [
    CreateQuoteUseCase,
    GetQuotesUseCase,
    GetQuoteByIdUseCase,
    UpdateQuoteUseCase,
    StructuredLogger,
    {
      provide: 'QuoteRepositoryPort',
      useClass: QuoteRepositoryAdapter,
    },
  ],
})
export class QuoteModule {}
