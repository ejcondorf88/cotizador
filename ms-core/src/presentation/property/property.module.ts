import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyController } from './property.controller';
import { PropertyTypeOrmEntity } from '../../infrastructure/property/entities/property.typeorm.entity';
import { PropertyTypeOrmRepository } from '../../infrastructure/property/repositories/property.typeorm.repository';
import { CreatePropertiesBulkUseCase } from '../../application/property/use-cases/create-properties-bulk.use-case';
import { GetPropertiesByQuoteUseCase } from '../../application/property/use-cases/get-properties-by-quote.use-case';
import { UpdatePropertyUseCase } from '../../application/property/use-cases/update-property.use-case';
import { DeletePropertiesByQuoteUseCase } from '../../application/property/use-cases/delete-properties-by-quote.use-case';
import { StructuredLogger } from '../../common/logger/logger.service';
import { QuoteModule } from '../quote/quote.module';
import { PROPERTY_REPOSITORY_PORT } from '../../domain/property/ports/property.repository.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyTypeOrmEntity]),
    QuoteModule,
  ],
  controllers: [PropertyController],
  providers: [
    {
      provide: PROPERTY_REPOSITORY_PORT,
      useClass: PropertyTypeOrmRepository,
    },
    CreatePropertiesBulkUseCase,
    GetPropertiesByQuoteUseCase,
    UpdatePropertyUseCase,
    DeletePropertiesByQuoteUseCase,
    StructuredLogger,
  ],
  exports: [PROPERTY_REPOSITORY_PORT],
})
export class PropertyModule {}
