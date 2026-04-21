import { Giro } from '../entities/giro.entity';

export interface GiroRepositoryPort {
  create(giro: Giro): Promise<Giro>;
  findById(id: string): Promise<Giro | null>;
  findAll(options: { page: number; limit: number }): Promise<{ items: Giro[]; total: number }>;
  findByClave(clave: string): Promise<Giro | null>;
  search(query: string, options: { page: number; limit: number }): Promise<{ items: Giro[]; total: number }>;
  update(id: string, giro: Giro): Promise<Giro>;
  delete(id: string): Promise<void>;
}

export const GIRO_REPOSITORY_PORT = Symbol('GiroRepositoryPort');
