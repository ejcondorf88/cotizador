import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteController } from './quote.controller';
import { CreateQuoteUseCase } from '../../application/quote/use-cases/create-quote.use-case';
import { QuoteRepositoryAdapter } from '../../infrastructure/quote/adapters/quote-repository.adapter';
import { QuoteTypeOrmEntity } from '../../infrastructure/quote/entities/quote.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuoteTypeOrmEntity])],
  controllers: [QuoteController],
  providers: [
    CreateQuoteUseCase,
    {
      provide: 'QuoteRepositoryPort',
      useClass: QuoteRepositoryAdapter,
    },
  ],
})
export class QuoteModule {}
