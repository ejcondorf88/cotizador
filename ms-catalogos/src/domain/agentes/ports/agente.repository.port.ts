import { Agente } from '../entities/agente.entity';

export interface AgenteRepositoryPort {
  create(agente: Agente): Promise<Agente>;
  findById(id: string): Promise<Agente | null>;
  findAll(options: { page: number; limit: number }): Promise<{ items: Agente[]; total: number }>;
  findByCodigo(codigo: string): Promise<Agente | null>;
  search(query: string, options: { page: number; limit: number }): Promise<{ items: Agente[]; total: number }>;
  findByOficina(oficinaId: string, options: { page: number; limit: number }): Promise<{ items: Agente[]; total: number }>;
  update(id: string, agente: Agente): Promise<Agente>;
  delete(id: string): Promise<void>;
}

export const AGENTE_REPOSITORY_PORT = Symbol('AgenteRepositoryPort');
