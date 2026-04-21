import { SuscriptorMapper } from '../suscriptor.mapper';
import { SuscriptorTypeOrmEntity } from '../../entities/suscriptor.typeorm.entity';
import { Suscriptor } from '../../../../domain/suscriptores/entities/suscriptor.entity';

describe('Infrastructure/Suscriptores - SuscriptorMapper', () => {
  describe('toDomain()', () => {
    it('should convert TypeORM entity to Domain entity', () => {
      // Arrange
      const typeormEntity = new SuscriptorTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440002';
      typeormEntity.codigo = 'SUB-001';
      typeormEntity.nombre = 'Suscriptor Test';
      typeormEntity.tipo = 'PREMIUM';
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date('2026-01-15T10:00:00Z');
      typeormEntity.updatedAt = new Date('2026-01-15T10:30:00Z');

      // Act
      const domain = SuscriptorMapper.toDomain(typeormEntity);

      // Assert
      expect(domain).toBeInstanceOf(Suscriptor);
      expect(domain.id).toBe('550e8400-e29b-41d4-a716-446655440002');
      expect(domain.codigo).toBe('SUB-001');
      expect(domain.nombre).toBe('Suscriptor Test');
      expect(domain.tipo).toBe('PREMIUM');
      expect(domain.activo).toBe(true);
    });

    it('should handle null tipo', () => {
      // Arrange
      const typeormEntity = new SuscriptorTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440002';
      typeormEntity.codigo = 'SUB-001';
      typeormEntity.nombre = 'Suscriptor Test';
      typeormEntity.tipo = null;
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date();
      typeormEntity.updatedAt = new Date();

      // Act
      const domain = SuscriptorMapper.toDomain(typeormEntity);

      // Assert
      expect(domain.tipo).toBeNull();
    });
  });

  describe('toTypeOrm()', () => {
    it('should convert Domain entity to TypeORM entity', () => {
      // Arrange
      const domain = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
        tipo: 'PREMIUM',
      });
      (domain as any).id = '550e8400-e29b-41d4-a716-446655440002';

      // Act
      const typeorm = SuscriptorMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm).toBeInstanceOf(SuscriptorTypeOrmEntity);
      expect(typeorm.id).toBe('550e8400-e29b-41d4-a716-446655440002');
      expect(typeorm.codigo).toBe('SUB-001');
      expect(typeorm.nombre).toBe('Suscriptor Test');
      expect(typeorm.tipo).toBe('PREMIUM');
    });

    it('should handle null tipo', () => {
      // Arrange
      const domain = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });

      // Act
      const typeorm = SuscriptorMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm.tipo).toBeNull();
    });
  });

  describe('bidirectional conversion', () => {
    it('should preserve all fields after round-trip', () => {
      // Arrange
      const original = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
        tipo: 'GOLD',
      });
      (original as any).id = '550e8400-e29b-41d4-a716-446655440002';

      // Act
      const typeorm = SuscriptorMapper.toTypeOrm(original);
      const converted = SuscriptorMapper.toDomain(typeorm);

      // Assert
      expect(converted.id).toBe(original.id);
      expect(converted.codigo).toBe(original.codigo);
      expect(converted.nombre).toBe(original.nombre);
      expect(converted.tipo).toBe(original.tipo);
      expect(converted.activo).toBe(original.activo);
    });
  });
});
