import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { OficinaTypeOrmEntity } from '../entities/oficina.typeorm.entity';
import { OficinaMapper } from '../mappers/oficina.mapper';
import { OficinaRepositoryPort } from '../../../domain/oficinas/ports/oficina.repository.port';
import { Oficina } from '../../../domain/oficinas/entities/oficina.entity';

@Injectable()
export class OficinaRepositoryAdapter implements OficinaRepositoryPort {
  constructor(
    @InjectRepository(OficinaTypeOrmEntity)
    private readonly typeormRepo: Repository<OficinaTypeOrmEntity>,
  ) {}

  async create(oficina: Oficina): Promise<Oficina> {
    const typeormEntity = OficinaMapper.toTypeOrm(oficina);
    const saved = await this.typeormRepo.save(typeormEntity);
    return OficinaMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Oficina | null> {
    const found = await this.typeormRepo.findOne({ where: { id } });
    return found ? OficinaMapper.toDomain(found) : null;
  }

  async findAll(options: { page: number; limit: number }): Promise<{ items: Oficina[]; total: number }> {
    const [results, total] = await this.typeormRepo.findAndCount({
      where: { activo: true },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { nombre: 'ASC' },
    });

    return {
      items: results.map(OficinaMapper.toDomain),
      total,
    };
  }

  async findByCodigo(codigo: string): Promise<Oficina | null> {
    const found = await this.typeormRepo.findOne({ where: { codigo } });
    return found ? OficinaMapper.toDomain(found) : null;
  }

  async findByEstado(estado: string, options: { page: number; limit: number }): Promise<{ items: Oficina[]; total: number }> {
    const [results, total] = await this.typeormRepo.findAndCount({
      where: { estado, activo: true },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { nombre: 'ASC' },
    });

    return {
      items: results.map(OficinaMapper.toDomain),
      total,
    };
  }

  async update(id: string, oficina: Oficina): Promise<Oficina> {
    const typeormEntity = OficinaMapper.toTypeOrm(oficina);
    await this.typeormRepo.update(id, {
      codigo: typeormEntity.codigo,
      nombre: typeormEntity.nombre,
      ciudad: typeormEntity.ciudad,
      estado: typeormEntity.estado,
      activo: typeormEntity.activo,
      updatedAt: new Date(),
    });

    const updated = await this.typeormRepo.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Oficina con ID ${id} no encontrada después de actualizar`);
    }
    return OficinaMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    // Soft delete: marcar como inactivo
    await this.typeormRepo.update(id, { activo: false, updatedAt: new Date() });
  }
}
