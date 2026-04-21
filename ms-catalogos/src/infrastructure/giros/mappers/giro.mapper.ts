import { GiroTypeOrmEntity } from '../entities/giro.typeorm.entity';
import { Giro } from '../../../domain/giros/entities/giro.entity';

export class GiroMapper {
  static toDomain(typeormEntity: GiroTypeOrmEntity): Giro {
    return new Giro(
      typeormEntity.id,
      typeormEntity.clave,
      typeormEntity.descripcion,
      typeormEntity.sector,
      typeormEntity.riesgo,
      typeormEntity.activo,
      typeormEntity.createdAt,
      typeormEntity.updatedAt,
    );
  }

  static toTypeOrm(entity: Giro): GiroTypeOrmEntity {
    const typeormEntity = new GiroTypeOrmEntity();
    typeormEntity.id = entity.id;
    typeormEntity.clave = entity.clave;
    typeormEntity.descripcion = entity.descripcion;
    typeormEntity.sector = entity.sector;
    typeormEntity.riesgo = entity.riesgo;
    typeormEntity.activo = entity.activo;
    typeormEntity.createdAt = entity.createdAt;
    typeormEntity.updatedAt = entity.updatedAt;
    return typeormEntity;
  }
}
