import { CotizacionTypeOrmEntity } from '../entities/cotizacion.typeorm.entity';
import { Cotizacion } from '../../../domain/cotizacion/entities/cotizacion.entity';
import { CotizacionResponseDto } from '../../../application/cotizacion/dto/cotizacion-response.dto';

export class CotizacionMapper {
  static toDomain(entity: CotizacionTypeOrmEntity): Cotizacion {
    return new Cotizacion(
      entity.id,
      entity.numeroFolio,
      entity.estado,
      entity.fechaCreacion,
      entity.fechaActualizacion,
    );
  }

  static toTypeOrm(entity: Cotizacion): CotizacionTypeOrmEntity {
    const typeormEntity = new CotizacionTypeOrmEntity();
    typeormEntity.id = entity.id;
    typeormEntity.numeroFolio = entity.numeroFolio;
    typeormEntity.estado = entity.estado;
    typeormEntity.fechaCreacion = entity.fechaCreacion;
    typeormEntity.fechaActualizacion = entity.fechaActualizacion;
    return typeormEntity;
  }

  static toResponseDto(entity: Cotizacion): CotizacionResponseDto {
    const dto = new CotizacionResponseDto();
    dto.id = entity.id;
    dto.numeroFolio = entity.numeroFolio;
    dto.estado = entity.estado;
    dto.fechaCreacion = entity.fechaCreacion;
    dto.fechaActualizacion = entity.fechaActualizacion;
    return dto;
  }
}
