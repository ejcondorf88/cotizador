import { Property } from '../entities/property.entity';

export const PROPERTY_REPOSITORY_PORT = Symbol('PropertyRepositoryPort');

export interface PropertyRepositoryPort {
  findById(id: string): Promise<Property | null>;
  findByQuoteId(quoteId: string): Promise<Property[]>;
  create(property: Property): Promise<Property>;
  createBulk(properties: Property[]): Promise<Property[]>;
  update(id: string, data: Partial<Property>): Promise<Property>;
  deleteById(id: string): Promise<void>;
  deleteByQuoteId(quoteId: string): Promise<void>;
}
