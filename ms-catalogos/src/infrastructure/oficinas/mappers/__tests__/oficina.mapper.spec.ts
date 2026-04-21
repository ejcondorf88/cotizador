import { OficinaMapper } from '../oficina.mapper';
import { OficinaTypeOrmEntity } from '../../entities/oficina.typeorm.entity';
import { Oficina } from '../../../../domain/oficinas/entities/oficina.entity';

describe('Infrastructure/Oficinas - OficinaMapper', () => {
  describe('toDomain()', () => {
    it('should convert TypeORM entity to Domain entity', () => {
      // Arrange
      const typeormEntity = new OficinaTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440003';
      typeormEntity.codigo = 'OF-001';
      typeormEntity.nombre = 'Oficina Principal';
      typeormEntity.ciudad = 'Ciudad de México';
      typeormEntity.estado = 'CDMX';
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date('2026-01-15T10:00:00Z');
      typeormEntity.updatedAt = new Date('2026-01-15T10:30:00Z');

      // Act
      const domain = OficinaMapper.toDomain(typeormEntity);

      // Assert
      expect(domain).toBeInstanceOf(Oficina);
      expect(domain.id).toBe('550e8400-e29b-41d4-a716-446655440003');
      expect(domain.codigo).toBe('OF-001');
      expect(domain.nombre).toBe('Oficina Principal');
      expect(domain.ciudad).toBe('Ciudad de México');
      expect(domain.estado).toBe('CDMX');
      expect(domain.activo).toBe(true);
    });

    it('should handle null ciudad and estado', () => {
      // Arrange
      const typeormEntity = new OficinaTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440003';
      typeormEntity.codigo = 'OF-001';
      typeormEntity.nombre = 'Oficina Principal';
      typeormEntity.ciudad = null;
      typeormEntity.estado = null;
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date();
      typeormEntity.updatedAt = new Date();

      // Act
      const domain = OficinaMapper.toDomain(typeormEntity);

      // Assert
      expect(domain.ciudad).toBeNull();
      expect(domain.estado).toBeNull();
    });
  });

  describe('toTypeOrm()', () => {
    it('should convert Domain entity to TypeORM entity', () => {
      // Arrange
      const domain = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
      });
      (domain as any).id = '550e8400-e29b-41d4-a716-446655440003';

      // Act
      const typeorm = OficinaMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm).toBeInstanceOf(OficinaTypeOrmEntity);
      expect(typeorm.id).toBe('550e8400-e29b-41d4-a716-446655440003');
      expect(typeorm.codigo).toBe('OF-001');
      expect(typeorm.nombre).toBe('Oficina Principal');
      expect(typeorm.ciudad).toBe('Ciudad de México');
      expect(typeorm.estado).toBe('CDMX');
    });

    it('should handle null ciudad and estado', () => {
      // Arrange
      const domain = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });

      // Act
      const typeorm = OficinaMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm.ciudad).toBeNull();
      expect(typeorm.estado).toBeNull();
    });
  });

  describe('bidirectional conversion', () => {
    it('should preserve all fields after round-trip', () => {
      // Arrange
      const original = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
      });
      (original as any).id = '550e8400-e29b-41d4-a716-446655440003';

      // Act
      const typeorm = OficinaMapper.toTypeOrm(original);
      const converted = OficinaMapper.toDomain(typeorm);

      // Assert
      expect(converted.id).toBe(original.id);
      expect(converted.codigo).toBe(original.codigo);
      expect(converted.nombre).toBe(original.nombre);
      expect(converted.ciudad).toBe(original.ciudad);
      expect(converted.estado).toBe(original.estado);
      expect(converted.activo).toBe(original.activo);
    });
  });
});
