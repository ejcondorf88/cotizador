import { Property } from '../../../domain/property/entities/property.entity';
import { PropertyTypeOrmEntity } from '../entities/property.typeorm.entity';
import { ConstructionType } from '../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../domain/property/enums/property-usage.enum';

export class PropertyMapper {
  static toDomain(entity: PropertyTypeOrmEntity): Property {
    return new Property(
      entity.id,
      entity.quoteId,
      entity.name,
      {
        street: entity.street,
        neighborhood: entity.neighborhood,
        city: entity.city,
        state: entity.state,
        zipCode: entity.zipCode,
      },
      Number(entity.insuredValue),
      entity.constructionType,
      entity.usage,
      entity.completionPercentage,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: Property): PropertyTypeOrmEntity {
    const entity = new PropertyTypeOrmEntity();
    entity.id = domain.id;
    entity.quoteId = domain.quoteId;
    entity.name = domain.name;
    entity.street = domain.address.street;
    entity.neighborhood = domain.address.neighborhood;
    entity.city = domain.address.city;
    entity.state = domain.address.state;
    entity.zipCode = domain.address.zipCode;
    entity.insuredValue = domain.insuredValue;
    entity.constructionType = domain.constructionType;
    entity.usage = domain.usage;
    entity.completionPercentage = domain.completionPercentage;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  static toDomainList(entities: PropertyTypeOrmEntity[]): Property[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
