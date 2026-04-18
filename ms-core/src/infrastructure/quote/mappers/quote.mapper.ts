import { Quote } from '../../../domain/quote/entities/quote.entity';
import { QuoteResponseDto } from '../../../application/quote/dto/quote-response.dto';
import { QuoteTypeOrmEntity } from '../entities/quote.typeorm.entity';
import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';

export class QuoteMapper {
  static toDomain(entity: QuoteTypeOrmEntity): Quote {
    return new Quote(
      entity.id,
      entity.folioNumber,
      entity.status as QuoteStatus,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: Quote): QuoteTypeOrmEntity {
    const entity = new QuoteTypeOrmEntity();
    entity.id = domain.id;
    entity.folioNumber = domain.folioNumber;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  static toResponseDto(quote: Quote): QuoteResponseDto {
    return {
      id: quote.id,
      folioNumber: quote.folioNumber,
      status: quote.status,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
    };
  }
}
