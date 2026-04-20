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
    
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.constructionType !== undefined) {
      // @ts-ignore
      constructionUpdate.type = data.constructionType;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.constructionYear !== undefined) {
      // @ts-ignore
      constructionUpdate.year = data.constructionYear;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.levels !== undefined) {
      // @ts-ignore
      constructionUpdate.levels = data.levels;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.propertyUsage !== undefined) {
      // @ts-ignore
      constructionUpdate.usage = data.propertyUsage;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.specificActivity !== undefined) {
      // @ts-ignore
      constructionUpdate.specificActivity = data.specificActivity;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.activityCode !== undefined) {
      // @ts-ignore
      constructionUpdate.activityCode = data.activityCode;
    }

    if (Object.keys(constructionUpdate).length > 0) {
      updateData.construction = constructionUpdate;
    }

    // Coverages - map from flat fields or nested object
    const coveragesUpdate: Partial<typeof existing.coverages> = {};
    
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.coverageBuilding !== undefined) {
      // @ts-ignore
      coveragesUpdate.building = data.coverageBuilding;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.coverageContents !== undefined) {
      // @ts-ignore
      coveragesUpdate.contents = data.coverageContents;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.coverageElectronic !== undefined) {
      // @ts-ignore
      coveragesUpdate.electronicEquipment = data.coverageElectronic;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.coverageMachinery !== undefined) {
      // @ts-ignore
      coveragesUpdate.machinery = data.coverageMachinery;
    }
    // @ts-ignore - Handle legacy flat fields from DTO
    if (data.coverageStock !== undefined) {
      // @ts-ignore
      coveragesUpdate.stock = data.coverageStock;
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
