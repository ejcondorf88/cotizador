import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyRepositoryPort } from '../../../domain/property/ports/property.repository.port';
import { Property } from '../../../domain/property/entities/property.entity';
import { PropertyTypeOrmEntity } from '../entities/property.typeorm.entity';
import { PropertyMapper } from '../mappers/property.mapper';

@Injectable()
export class PropertyTypeOrmRepository implements PropertyRepositoryPort {
  constructor(
    @InjectRepository(PropertyTypeOrmEntity)
    private readonly repository: Repository<PropertyTypeOrmEntity>,
  ) {}

  async findById(id: string): Promise<Property | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? PropertyMapper.toDomain(entity) : null;
  }

  async findByQuoteId(quoteId: string): Promise<Property[]> {
    const entities = await this.repository.find({
      where: { quoteId },
      order: { createdAt: 'ASC' },
    });
    return PropertyMapper.toDomainList(entities);
  }

  async create(property: Property): Promise<Property> {
    const entity = PropertyMapper.toEntity(property);
    const saved = await this.repository.save(entity);
    return PropertyMapper.toDomain(saved);
  }

  async createBulk(properties: Property[]): Promise<Property[]> {
    const entities = properties.map((p) => PropertyMapper.toEntity(p));
    const saved = await this.repository.save(entities);
    return PropertyMapper.toDomainList(saved);
  }

  async update(id: string, data: Partial<Property>): Promise<Property> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }

    // Build update data - map flat fields from DTO to nested structure
    const updateData: Parameters<typeof existing.update>[0] = {};

    // Name
    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    // Address
    if (data.address) {
      updateData.address = data.address;
    }

    // Construction - map from flat fields or nested object
    const constructionUpdate: Partial<typeof existing.construction> = {};
    
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.constructionType !== undefined || data.construction?.type !== undefined) {
  // @ts-ignore
  constructionUpdate.type = data.constructionType ?? data.construction?.type;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.constructionYear !== undefined || data.construction?.year !== undefined) {
  // @ts-ignore
  constructionUpdate.year = data.constructionYear ?? data.construction?.year;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.levels !== undefined || data.construction?.levels !== undefined) {
  // @ts-ignore
  constructionUpdate.levels = data.levels ?? data.construction?.levels;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.propertyUsage !== undefined || data.construction?.usage !== undefined) {
  // @ts-ignore
  constructionUpdate.usage = data.propertyUsage ?? data.construction?.usage;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.specificActivity !== undefined || data.construction?.specificActivity !== undefined) {
  // @ts-ignore
  constructionUpdate.specificActivity = data.specificActivity ?? data.construction?.specificActivity;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.activityCode !== undefined || data.construction?.activityCode !== undefined) {
  // @ts-ignore
  constructionUpdate.activityCode = data.activityCode ?? data.construction?.activityCode;
}

    if (Object.keys(constructionUpdate).length > 0) {
      updateData.construction = constructionUpdate;
    }

// Coverages - map from flat fields or nested object
const coveragesUpdate: Partial<typeof existing.coverages> = {};

// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.coverageBuilding !== undefined || data.coverages?.building !== undefined) {
  // @ts-ignore
  coveragesUpdate.building = data.coverageBuilding ?? data.coverages?.building;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.coverageContents !== undefined || data.coverages?.contents !== undefined) {
  // @ts-ignore
  coveragesUpdate.contents = data.coverageContents ?? data.coverages?.contents;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.coverageElectronic !== undefined || data.coverages?.electronicEquipment !== undefined) {
  // @ts-ignore
  coveragesUpdate.electronicEquipment = data.coverageElectronic ?? data.coverages?.electronicEquipment;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.coverageMachinery !== undefined || data.coverages?.machinery !== undefined) {
  // @ts-ignore
  coveragesUpdate.machinery = data.coverageMachinery ?? data.coverages?.machinery;
}
// @ts-ignore - Handle legacy flat fields from DTO or nested object
if (data.coverageStock !== undefined || data.coverages?.stock !== undefined) {
  // @ts-ignore
  coveragesUpdate.stock = data.coverageStock ?? data.coverages?.stock;
}

    if (Object.keys(coveragesUpdate).length > 0) {
      updateData.coverages = coveragesUpdate;
    }

    // Update domain entity
    existing.update(updateData);

    // Save to database
    const entity = PropertyMapper.toEntity(existing);
    const saved = await this.repository.save(entity);
    return PropertyMapper.toDomain(saved);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByQuoteId(quoteId: string): Promise<void> {
    await this.repository.delete({ quoteId });
  }
}
