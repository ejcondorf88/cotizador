import { Quote, QuoteDetails } from '../../../domain/quote/entities/quote.entity';
import { QuoteResponseDto, QuoteDetailsDto } from '../../../application/quote/dto/quote-response.dto';
import { QuoteTypeOrmEntity } from '../entities/quote.typeorm.entity';
import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';

export class QuoteMapper {
  static toDomain(entity: QuoteTypeOrmEntity): Quote {
    const details: QuoteDetails | undefined = entity.companyName ? {
      companyName: entity.companyName,
      rfc: entity.rfc,
      businessLine: entity.businessLine,
      businessType: entity.businessType,
      agentKey: entity.agentKey,
      agentName: entity.agentName,
      subscriber: entity.subscriber,
      office: entity.office,
      validityStart: entity.validityStart,
      validityEnd: entity.validityEnd,
      currency: entity.currency as 'MXN' | 'USD',
      paymentType: entity.paymentType as 'CONTADO' | 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL',
    } : undefined;

    return new Quote(
      entity.id,
      entity.folioNumber,
      entity.status as QuoteStatus,
      entity.createdAt,
      entity.updatedAt,
      details,
      entity.propertyCount,
      entity.netPremium,
      entity.commercialPremium,
      entity.commercialFactor,
      entity.calculatedAt,
      entity.version,
    );
  }

  static toEntity(domain: Quote): QuoteTypeOrmEntity {
    const entity = new QuoteTypeOrmEntity();
    entity.id = domain.id;
    entity.folioNumber = domain.folioNumber;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    if (domain.details) {
      entity.companyName = domain.details.companyName;
      entity.rfc = domain.details.rfc;
      entity.businessLine = domain.details.businessLine;
      entity.businessType = domain.details.businessType;
      entity.agentKey = domain.details.agentKey;
      entity.agentName = domain.details.agentName;
      entity.subscriber = domain.details.subscriber;
      entity.office = domain.details.office;
      entity.validityStart = domain.details.validityStart;
      entity.validityEnd = domain.details.validityEnd;
      entity.currency = domain.details.currency;
      entity.paymentType = domain.details.paymentType;
    }

    // Campos de prima
    entity.netPremium = domain.netPremium;
    entity.commercialPremium = domain.commercialPremium;
    entity.commercialFactor = domain.commercialFactor;
    entity.calculatedAt = domain.calculatedAt;
    entity.version = domain.version;
    entity.propertyCount = domain.propertyCount;

    return entity;
  }

  static toResponseDto(quote: Quote): QuoteResponseDto {
    const dto: QuoteResponseDto = {
      id: quote.id,
      folioNumber: quote.folioNumber,
      status: quote.status,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      netPremium: quote.netPremium,
      commercialPremium: quote.commercialPremium,
      commercialFactor: quote.commercialFactor,
      calculatedAt: quote.calculatedAt,
      version: quote.version,
    };

    if (quote.details) {
      dto.details = {
        companyName: quote.details.companyName,
        rfc: quote.details.rfc,
        businessLine: quote.details.businessLine,
        businessType: quote.details.businessType,
        agentKey: quote.details.agentKey,
        agentName: quote.details.agentName,
        subscriber: quote.details.subscriber,
        office: quote.details.office,
        validityStart: quote.details.validityStart,
        validityEnd: quote.details.validityEnd,
        currency: quote.details.currency,
        paymentType: quote.details.paymentType,
      };
    }

    return dto;
  }
}
