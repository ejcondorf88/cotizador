import { AgenteMapper } from '../agente.mapper';
import { AgenteTypeOrmEntity } from '../../entities/agente.typeorm.entity';
import { Agente } from '../../../../domain/agentes/entities/agente.entity';

describe('Infrastructure/Agentes - AgenteMapper', () => {
  describe('toDomain()', () => {
    it('should convert TypeORM entity to Domain entity', () => {
      // Arrange
      const typeormEntity = new AgenteTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440001';
      typeormEntity.codigo = 'AGT-001';
      typeormEntity.nombre = 'Juan Pérez';
      typeormEntity.email = 'juan@test.com';
      typeormEntity.telefono = '555-1234';
      typeormEntity.oficinaId = 'oficina-uuid-001';
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date('2026-01-15T10:00:00Z');
      typeormEntity.updatedAt = new Date('2026-01-15T10:30:00Z');

      // Act
      const domain = AgenteMapper.toDomain(typeormEntity);

      // Assert
      expect(domain).toBeInstanceOf(Agente);
      expect(domain.id).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(domain.codigo).toBe('AGT-001');
      expect(domain.nombre).toBe('Juan Pérez');
      expect(domain.email).toBe('juan@test.com');
      expect(domain.telefono).toBe('555-1234');
      expect(domain.oficinaId).toBe('oficina-uuid-001');
      expect(domain.activo).toBe(true);
    });

    it('should handle null optional fields', () => {
      // Arrange
      const typeormEntity = new AgenteTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440001';
      typeormEntity.codigo = 'AGT-001';
      typeormEntity.nombre = 'Juan Pérez';
      typeormEntity.email = null;
      typeormEntity.telefono = null;
      typeormEntity.oficinaId = null;
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date();
      typeormEntity.updatedAt = new Date();

      // Act
      const domain = AgenteMapper.toDomain(typeormEntity);

      // Assert
      expect(domain.email).toBeNull();
      expect(domain.telefono).toBeNull();
      expect(domain.oficinaId).toBeNull();
    });
  });

  describe('toTypeOrm()', () => {
    it('should convert Domain entity to TypeORM entity', () => {
      // Arrange
      const domain = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Juan Pérez',
        email: 'juan@test.com',
        telefono: '555-1234',
        oficinaId: 'oficina-uuid-001',
      });
      (domain as any).id = '550e8400-e29b-41d4-a716-446655440001';

      // Act
      const typeorm = AgenteMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm).toBeInstanceOf(AgenteTypeOrmEntity);
      expect(typeorm.id).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(typeorm.codigo).toBe('AGT-001');
      expect(typeorm.nombre).toBe('Juan Pérez');
      expect(typeorm.email).toBe('juan@test.com');
      expect(typeorm.telefono).toBe('555-1234');
      expect(typeorm.oficinaId).toBe('oficina-uuid-001');
    });

    it('should handle null optional fields', () => {
      // Arrange
      const domain = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Juan Pérez',
      });

      // Act
      const typeorm = AgenteMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm.email).toBeNull();
      expect(typeorm.telefono).toBeNull();
      expect(typeorm.oficinaId).toBeNull();
    });
  });

  describe('bidirectional conversion', () => {
    it('should preserve all fields after round-trip', () => {
      // Arrange
      const original = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Juan Pérez',
        email: 'juan@test.com',
        telefono: '555-1234',
        oficinaId: 'oficina-uuid-001',
      });
      (original as any).id = '550e8400-e29b-41d4-a716-446655440001';

      // Act
      const typeorm = AgenteMapper.toTypeOrm(original);
      const converted = AgenteMapper.toDomain(typeorm);

      // Assert
      expect(converted.id).toBe(original.id);
      expect(converted.codigo).toBe(original.codigo);
      expect(converted.nombre).toBe(original.nombre);
      expect(converted.email).toBe(original.email);
      expect(converted.telefono).toBe(original.telefono);
      expect(converted.oficinaId).toBe(original.oficinaId);
      expect(converted.activo).toBe(original.activo);
    });

    it('should preserve null fields after round-trip', () => {
      // Arrange
      const original = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Juan Pérez',
      });

      // Act
      const typeorm = AgenteMapper.toTypeOrm(original);
      const converted = AgenteMapper.toDomain(typeorm);

      // Assert
      expect(converted.email).toBeNull();
      expect(converted.telefono).toBeNull();
      expect(converted.oficinaId).toBeNull();
    });
  });
});
