import { AgenteTypeOrmEntity } from '../entities/agente.typeorm.entity';
import { Agente } from '../../../domain/agentes/entities/agente.entity';

export class AgenteMapper {
  static toDomain(typeormEntity: AgenteTypeOrmEntity): Agente {
    return new Agente(
      typeormEntity.id,
      typeormEntity.codigo,
      typeormEntity.nombre,
      typeormEntity.email,
      typeormEntity.telefono,
      typeormEntity.oficinaId,
      typeormEntity.activo,
      typeormEntity.createdAt,
      typeormEntity.updatedAt,
    );
  }

  static toTypeOrm(entity: Agente): AgenteTypeOrmEntity {
    const typeormEntity = new AgenteTypeOrmEntity();
    typeormEntity.id = entity.id;
    typeormEntity.codigo = entity.codigo;
    typeormEntity.nombre = entity.nombre;
    typeormEntity.email = entity.email;
    typeormEntity.telefono = entity.telefono;
    typeormEntity.oficinaId = entity.oficinaId;
    typeormEntity.activo = entity.activo;
    typeormEntity.createdAt = entity.createdAt;
    typeormEntity.updatedAt = entity.updatedAt;
    return typeormEntity;
  }
}
