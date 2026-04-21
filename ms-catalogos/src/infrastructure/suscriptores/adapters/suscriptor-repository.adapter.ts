import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { SuscriptorTypeOrmEntity } from '../entities/suscriptor.typeorm.entity';
import { SuscriptorMapper } from '../mappers/suscriptor.mapper';
import { SuscriptorRepositoryPort } from '../../../domain/suscriptores/ports/suscriptor.repository.port';
import { Suscriptor } from '../../../domain/suscriptores/entities/suscriptor.entity';

@Injectable()
export class SuscriptorRepositoryAdapter implements SuscriptorRepositoryPort {
  constructor(
    @InjectRepository(SuscriptorTypeOrmEntity)
    private readonly typeormRepo: Repository<SuscriptorTypeOrmEntity>,
  ) {}

  async create(suscriptor: Suscriptor): Promise<Suscriptor> {
    const typeormEntity = SuscriptorMapper.toTypeOrm(suscriptor);
    const saved = await this.typeormRepo.save(typeormEntity);
    return SuscriptorMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Suscriptor | null> {
    const found = await this.typeormRepo.findOne({ where: { id } });
    return found ? SuscriptorMapper.toDomain(found) : null;
  }

  async findAll(options: { page: number; limit: number }): Promise<{ items: Suscriptor[]; total: number }> {
    const [results, total] = await this.typeormRepo.findAndCount({
      where: { activo: true },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { nombre: 'ASC' },
    });

    return {
      items: results.map(SuscriptorMapper.toDomain),
      total,
    };
  }

  async findByCodigo(codigo: string): Promise<Suscriptor | null> {
    const found = await this.typeormRepo.findOne({ where: { codigo } });
    return found ? SuscriptorMapper.toDomain(found) : null;
  }

  async search(query: string, options: { page: number; limit: number }): Promise<{ items: Suscriptor[]; total: number }> {
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
      items: results.map(SuscriptorMapper.toDomain),
      total,
    };
  }

  async update(id: string, suscriptor: Suscriptor): Promise<Suscriptor> {
    const typeormEntity = SuscriptorMapper.toTypeOrm(suscriptor);
    await this.typeormRepo.update(id, {
      codigo: typeormEntity.codigo,
      nombre: typeormEntity.nombre,
      tipo: typeormEntity.tipo,
      activo: typeormEntity.activo,
      updatedAt: new Date(),
    });

    const updated = await this.typeormRepo.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Suscriptor con ID ${id} no encontrado después de actualizar`);
    }
    return SuscriptorMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    // Soft delete: marcar como inactivo
    await this.typeormRepo.update(id, { activo: false, updatedAt: new Date() });
  }
}
