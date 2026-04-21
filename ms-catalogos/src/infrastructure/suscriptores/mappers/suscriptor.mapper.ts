import { SuscriptorTypeOrmEntity } from '../entities/suscriptor.typeorm.entity';
import { Suscriptor } from '../../../domain/suscriptores/entities/suscriptor.entity';

export class SuscriptorMapper {
  static toDomain(typeormEntity: SuscriptorTypeOrmEntity): Suscriptor {
    return new Suscriptor(
      typeormEntity.id,
      typeormEntity.codigo,
      typeormEntity.nombre,
      typeormEntity.tipo,
      typeormEntity.activo,
      typeormEntity.createdAt,
      typeormEntity.updatedAt,
    );
  }

  static toTypeOrm(entity: Suscriptor): SuscriptorTypeOrmEntity {
    const typeormEntity = new SuscriptorTypeOrmEntity();
    typeormEntity.id = entity.id;
    typeormEntity.codigo = entity.codigo;
    typeormEntity.nombre = entity.nombre;
    typeormEntity.tipo = entity.tipo;
    typeormEntity.activo = entity.activo;
    typeormEntity.createdAt = entity.createdAt;
    typeormEntity.updatedAt = entity.updatedAt;
    return typeormEntity;
  }
}
