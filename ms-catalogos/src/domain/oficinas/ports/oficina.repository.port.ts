import { Oficina } from '../entities/oficina.entity';

export interface OficinaRepositoryPort {
  create(oficina: Oficina): Promise<Oficina>;
  findById(id: string): Promise<Oficina | null>;
  findAll(options: { page: number; limit: number }): Promise<{ items: Oficina[]; total: number }>;
  findByCodigo(codigo: string): Promise<Oficina | null>;
  findByEstado(estado: string, options: { page: number; limit: number }): Promise<{ items: Oficina[]; total: number }>;
  update(id: string, oficina: Oficina): Promise<Oficina>;
  delete(id: string): Promise<void>;
}

export const OFICINA_REPOSITORY_PORT = Symbol('OficinaRepositoryPort');
