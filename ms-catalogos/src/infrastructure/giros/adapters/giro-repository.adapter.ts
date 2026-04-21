import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { GiroTypeOrmEntity } from '../entities/giro.typeorm.entity';
import { GiroMapper } from '../mappers/giro.mapper';
import { GiroRepositoryPort } from '../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../domain/giros/entities/giro.entity';

@Injectable()
export class GiroRepositoryAdapter implements GiroRepositoryPort {
  constructor(
    @InjectRepository(GiroTypeOrmEntity)
    private readonly typeormRepo: Repository<GiroTypeOrmEntity>,
  ) {}

  async create(giro: Giro): Promise<Giro> {
    const typeormEntity = GiroMapper.toTypeOrm(giro);
    const saved = await this.typeormRepo.save(typeormEntity);
    return GiroMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Giro | null> {
    const found = await this.typeormRepo.findOne({ where: { id } });
    return found ? GiroMapper.toDomain(found) : null;
  }

  async findAll(options: { page: number; limit: number }): Promise<{ items: Giro[]; total: number }> {
    const [results, total] = await this.typeormRepo.findAndCount({
      where: { activo: true },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { descripcion: 'ASC' },
    });

    return {
      items: results.map(GiroMapper.toDomain),
      total,
    };
  }

  async findByClave(clave: string): Promise<Giro | null> {
    const found = await this.typeormRepo.findOne({ where: { clave } });
    return found ? GiroMapper.toDomain(found) : null;
  }

  async search(query: string, options: { page: number; limit: number }): Promise<{ items: Giro[]; total: number }> {
    const [results, total] = await this.typeormRepo.findAndCount({
      where: [
        { descripcion: ILike(`%${query}%`), activo: true },
        { clave: ILike(`%${query}%`), activo: true },
      ],
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { descripcion: 'ASC' },
    });

    return {
      items: results.map(GiroMapper.toDomain),
      total,
    };
  }

  async update(id: string, giro: Giro): Promise<Giro> {
    const typeormEntity = GiroMapper.toTypeOrm(giro);
    await this.typeormRepo.update(id, {
      clave: typeormEntity.clave,
      descripcion: typeormEntity.descripcion,
      sector: typeormEntity.sector,
      riesgo: typeormEntity.riesgo,
      activo: typeormEntity.activo,
      updatedAt: new Date(),
    });

    const updated = await this.typeormRepo.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Giro con ID ${id} no encontrado después de actualizar`);
    }
    return GiroMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    // Soft delete: marcar como inactivo
    await this.typeormRepo.update(id, { activo: false, updatedAt: new Date() });
  }
}
