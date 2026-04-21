import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { AgenteTypeOrmEntity } from '../entities/agente.typeorm.entity';
import { AgenteMapper } from '../mappers/agente.mapper';
import { AgenteRepositoryPort } from '../../../domain/agentes/ports/agente.repository.port';
import { Agente } from '../../../domain/agentes/entities/agente.entity';

@Injectable()
export class AgenteRepositoryAdapter implements AgenteRepositoryPort {
  constructor(
    @InjectRepository(AgenteTypeOrmEntity)
    private readonly typeormRepo: Repository<AgenteTypeOrmEntity>,
  ) {}

  async create(agente: Agente): Promise<Agente> {
    const typeormEntity = AgenteMapper.toTypeOrm(agente);
    const saved = await this.typeormRepo.save(typeormEntity);
    return AgenteMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Agente | null> {
    const found = await this.typeormRepo.findOne({ where: { id } });
    return found ? AgenteMapper.toDomain(found) : null;
  }

  async findAll(options: { page: number; limit: number }): Promise<{ items: Agente[]; total: number }> {
    const [results, total] = await this.typeormRepo.findAndCount({
      where: { activo: true },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { nombre: 'ASC' },
    });

    return {
      items: results.map(AgenteMapper.toDomain),
      total,
    };
  }

  async findByCodigo(codigo: string): Promise<Agente | null> {
    const found = await this.typeormRepo.findOne({ where: { codigo } });
    return found ? AgenteMapper.toDomain(found) : null;
  }

  async search(query: string, options: { page: number; limit: number }): Promise<{ items: Agente[]; total: number }> {
    const [results, total] = await this.typeormRepo.findAndCount({
      where: [
        { nombre: ILike(`%${query}%`), activo: true },
        { codigo: ILike(`%${query}%`), activo: true },
      ],
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { nombre: 'ASC' },
    });

    return {
      items: results.map(AgenteMapper.toDomain),
      total,
    };
  }

  async findByOficina(oficinaId: string, options: { page: number; limit: number }): Promise<{ items: Agente[]; total: number }> {
    const [results, total] = await this.typeormRepo.findAndCount({
      where: { oficinaId, activo: true },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { nombre: 'ASC' },
    });

    return {
      items: results.map(AgenteMapper.toDomain),
      total,
    };
  }

  async update(id: string, agente: Agente): Promise<Agente> {
    const typeormEntity = AgenteMapper.toTypeOrm(agente);
    await this.typeormRepo.update(id, {
      codigo: typeormEntity.codigo,
      nombre: typeormEntity.nombre,
      email: typeormEntity.email,
      telefono: typeormEntity.telefono,
      oficinaId: typeormEntity.oficinaId,
      activo: typeormEntity.activo,
      updatedAt: new Date(),
    });

    const updated = await this.typeormRepo.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Agente con ID ${id} no encontrado después de actualizar`);
    }
    return AgenteMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    // Soft delete: marcar como inactivo
    await this.typeormRepo.update(id, { activo: false, updatedAt: new Date() });
  }
}
