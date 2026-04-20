import { Property } from '../../../domain/property/entities/property.entity';
import { PropertyTypeOrmEntity } from '../entities/property.typeorm.entity';
import { ConstructionType } from '../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../domain/property/enums/property-usage.enum';
import { PropertyStatus } from '../../../domain/property/enums/property-status.enum';

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
      {
      type: entity.constructionType as ConstructionType,
      year: entity.constructionYear ?? undefined,
      levels: entity.levels ?? undefined,
      usage: entity.propertyUsage as PropertyUsage,
      specificActivity: entity.specificActivity,
      activityCode: entity.activityCode ?? undefined,
    },
      {
        building: Number(entity.coverageBuilding),
        contents: Number(entity.coverageContents),
        electronicEquipment: Number(entity.coverageElectronic),
        machinery: Number(entity.coverageMachinery),
        stock: Number(entity.coverageStock),
      },
      entity.status as PropertyStatus,
      entity.completionPercentage,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(domain: Property): PropertyTypeOrmEntity {
    const entity = new PropertyTypeOrmEntity();
    entity.id = domain.id;
    entity.quoteId = domain.quoteId;
    
    // Ubicación
    entity.name = domain.name;
    entity.street = domain.address.street;
    entity.neighborhood = domain.address.neighborhood;
    entity.city = domain.address.city;
    entity.state = domain.address.state;
    entity.zipCode = domain.address.zipCode;
    
    // Construcción
    entity.constructionType = domain.construction.type;
    entity.constructionYear = domain.construction.year;
    entity.levels = domain.construction.levels;
    entity.propertyUsage = domain.construction.usage;
    entity.specificActivity = domain.construction.specificActivity;
    entity.activityCode = domain.construction.activityCode;
    
    // Garantías
    entity.coverageBuilding = domain.coverages.building;
    entity.coverageContents = domain.coverages.contents;
    entity.coverageElectronic = domain.coverages.electronicEquipment;
    entity.coverageMachinery = domain.coverages.machinery;
    entity.coverageStock = domain.coverages.stock;
    
    // Estado
    entity.status = domain.status;
    entity.completionPercentage = domain.completionPercentage;
    
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  static toDomainList(entities: PropertyTypeOrmEntity[]): Property[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
