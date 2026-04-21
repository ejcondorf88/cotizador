import { Suscriptor } from '../entities/suscriptor.entity';

export interface SuscriptorRepositoryPort {
  create(suscriptor: Suscriptor): Promise<Suscriptor>;
  findById(id: string): Promise<Suscriptor | null>;
  findAll(options: { page: number; limit: number }): Promise<{ items: Suscriptor[]; total: number }>;
  findByCodigo(codigo: string): Promise<Suscriptor | null>;
  search(query: string, options: { page: number; limit: number }): Promise<{ items: Suscriptor[]; total: number }>;
  update(id: string, suscriptor: Suscriptor): Promise<Suscriptor>;
  delete(id: string): Promise<void>;
}

export const SUSCRIPTOR_REPOSITORY_PORT = Symbol('SuscriptorRepositoryPort');
