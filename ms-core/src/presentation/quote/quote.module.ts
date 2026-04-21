import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteController } from './quote.controller';
import { CreateQuoteUseCase } from '../../application/quote/use-cases/create-quote.use-case';
import { GetQuotesUseCase } from '../../application/quote/use-cases/get-quotes.use-case';
import { GetQuoteByIdUseCase } from '../../application/quote/use-cases/get-quote-by-id.use-case';
import { UpdateQuoteUseCase } from '../../application/quote/use-cases/update-quote.use-case';
import { CalculatePremiumUseCase } from '../../application/quote/use-cases/calculate-premium.use-case';
import { QuoteRepositoryAdapter } from '../../infrastructure/quote/adapters/quote-repository.adapter';
import { QuoteTypeOrmEntity } from '../../infrastructure/quote/entities/quote.typeorm.entity';
import { PropertyTypeOrmEntity } from '../../infrastructure/property/entities/property.typeorm.entity';
import { PremiumBreakdownTypeOrmEntity } from '../../infrastructure/premium/entities/premium-breakdown.typeorm.entity';
import { StructuredLogger } from '../../common/logger/logger.service';
import { QUOTE_REPOSITORY_PORT } from '../../domain/quote/ports/quote.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([
    QuoteTypeOrmEntity,
    PropertyTypeOrmEntity,
    PremiumBreakdownTypeOrmEntity,
  ])],
  controllers: [QuoteController],
  providers: [
    CreateQuoteUseCase,
    GetQuotesUseCase,
    GetQuoteByIdUseCase,
    UpdateQuoteUseCase,
    CalculatePremiumUseCase,
    StructuredLogger,
    {
      provide: QUOTE_REPOSITORY_PORT,
      useClass: QuoteRepositoryAdapter,
    },
  ],
  exports: [QUOTE_REPOSITORY_PORT],
})
export class QuoteModule {}
