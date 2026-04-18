import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CotizacionTypeOrmEntity } from '../entities/cotizacion.typeorm.entity';
import { CotizacionMapper } from '../mappers/cotizacion.mapper';
import { CotizacionRepositoryPort } from '../../../domain/cotizacion/ports/cotizacion.repository.port';
import { Cotizacion } from '../../../domain/cotizacion/entities/cotizacion.entity';

@Injectable()
export class CotizacionRepositoryAdapter implements CotizacionRepositoryPort {
  constructor(
    @InjectRepository(CotizacionTypeOrmEntity)
    private readonly typeormRepo: Repository<CotizacionTypeOrmEntity>,
  ) {}

  async crear(cotizacion: Cotizacion): Promise<Cotizacion> {
    const entity = CotizacionMapper.toTypeOrm(cotizacion);
    const saved = await this.typeormRepo.save(entity);
    return CotizacionMapper.toDomain(saved);
  }

  async obtenerUltimoFolioDelYear(year: number): Promise<number> {
    const prefix = `COT-${year}-`;
    const result = await this.typeormRepo
      .createQueryBuilder('c')
      .where('c.numeroFolio LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('c.numeroFolio', 'DESC')
      .getOne();
    
    if (!result) return 0;
    return parseInt(result.numeroFolio.replace(prefix, ''), 10);
  }
}
