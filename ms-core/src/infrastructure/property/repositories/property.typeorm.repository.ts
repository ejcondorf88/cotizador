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

    // Update domain entity
    existing.update({
      name: data.name,
      address: data.address,
      insuredValue: data.insuredValue,
      constructionType: data.constructionType,
      usage: data.usage,
    });

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
