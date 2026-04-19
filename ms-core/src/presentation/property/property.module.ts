import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyController } from './property.controller';
import { PropertyTypeOrmEntity } from '../../infrastructure/property/entities/property.typeorm.entity';
import { PropertyTypeOrmRepository } from '../../infrastructure/property/repositories/property.typeorm.repository';
import { QuoteTypeOrmEntity } from '../../infrastructure/quote/entities/quote.typeorm.entity';
import { QuoteRepositoryAdapter } from '../../infrastructure/quote/adapters/quote-repository.adapter';
import { CreatePropertiesBulkUseCase } from '../../application/property/use-cases/create-properties-bulk.use-case';
import { GetPropertiesByQuoteUseCase } from '../../application/property/use-cases/get-properties-by-quote.use-case';
import { UpdatePropertyUseCase } from '../../application/property/use-cases/update-property.use-case';
import { DeletePropertiesByQuoteUseCase } from '../../application/property/use-cases/delete-properties-by-quote.use-case';
import { StructuredLogger } from '../../common/logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyTypeOrmEntity, QuoteTypeOrmEntity]),
  ],
  controllers: [PropertyController],
  providers: [
    {
      provide: 'PropertyRepositoryPort',
      useClass: PropertyTypeOrmRepository,
    },
    {
      provide: 'QuoteRepositoryPort',
      useClass: QuoteRepositoryAdapter,
    },
    CreatePropertiesBulkUseCase,
    GetPropertiesByQuoteUseCase,
    UpdatePropertyUseCase,
    DeletePropertiesByQuoteUseCase,
    StructuredLogger,
  ],
})
export class PropertyModule {}
