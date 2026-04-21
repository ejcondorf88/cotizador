import { OficinaTypeOrmEntity } from '../entities/oficina.typeorm.entity';
import { Oficina } from '../../../domain/oficinas/entities/oficina.entity';

export class OficinaMapper {
  static toDomain(typeormEntity: OficinaTypeOrmEntity): Oficina {
    return new Oficina(
      typeormEntity.id,
      typeormEntity.codigo,
      typeormEntity.nombre,
      typeormEntity.ciudad,
      typeormEntity.estado,
      typeormEntity.activo,
      typeormEntity.createdAt,
      typeormEntity.updatedAt,
    );
  }

  static toTypeOrm(entity: Oficina): OficinaTypeOrmEntity {
    const typeormEntity = new OficinaTypeOrmEntity();
    typeormEntity.id = entity.id;
    typeormEntity.codigo = entity.codigo;
    typeormEntity.nombre = entity.nombre;
    typeormEntity.ciudad = entity.ciudad;
    typeormEntity.estado = entity.estado;
    typeormEntity.activo = entity.activo;
    typeormEntity.createdAt = entity.createdAt;
    typeormEntity.updatedAt = entity.updatedAt;
    return typeormEntity;
  }
}
