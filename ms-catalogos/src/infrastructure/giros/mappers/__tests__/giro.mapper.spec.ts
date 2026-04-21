import { GiroMapper } from '../giro.mapper';
import { GiroTypeOrmEntity } from '../../entities/giro.typeorm.entity';
import { Giro } from '../../../../domain/giros/entities/giro.entity';

describe('Infrastructure/Giros - GiroMapper', () => {
  describe('toDomain()', () => {
    it('should convert TypeORM entity to Domain entity', () => {
      // Arrange
      const typeormEntity = new GiroTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440000';
      typeormEntity.clave = 'COM-001';
      typeormEntity.descripcion = 'Comercio al por mayor';
      typeormEntity.sector = 'Mayorista';
      typeormEntity.riesgo = 'MEDIO';
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date('2026-01-15T10:00:00Z');
      typeormEntity.updatedAt = new Date('2026-01-15T10:30:00Z');

      // Act
      const domain = GiroMapper.toDomain(typeormEntity);

      // Assert
      expect(domain).toBeInstanceOf(Giro);
      expect(domain.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(domain.clave).toBe('COM-001');
      expect(domain.descripcion).toBe('Comercio al por mayor');
      expect(domain.sector).toBe('Mayorista');
      expect(domain.riesgo).toBe('MEDIO');
      expect(domain.activo).toBe(true);
      expect(domain.createdAt).toEqual(new Date('2026-01-15T10:00:00Z'));
      expect(domain.updatedAt).toEqual(new Date('2026-01-15T10:30:00Z'));
    });

    it('should handle null sector', () => {
      // Arrange
      const typeormEntity = new GiroTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440000';
      typeormEntity.clave = 'COM-001';
      typeormEntity.descripcion = 'Comercio';
      typeormEntity.sector = null;
      typeormEntity.riesgo = 'MEDIO';
      typeormEntity.activo = true;
      typeormEntity.createdAt = new Date();
      typeormEntity.updatedAt = new Date();

      // Act
      const domain = GiroMapper.toDomain(typeormEntity);

      // Assert
      expect(domain.sector).toBeNull();
    });

    it('should convert inactive giro', () => {
      // Arrange
      const typeormEntity = new GiroTypeOrmEntity();
      typeormEntity.id = '550e8400-e29b-41d4-a716-446655440000';
      typeormEntity.clave = 'COM-001';
      typeormEntity.descripcion = 'Comercio';
      typeormEntity.sector = null;
      typeormEntity.riesgo = 'MEDIO';
      typeormEntity.activo = false;
      typeormEntity.createdAt = new Date();
      typeormEntity.updatedAt = new Date();

      // Act
      const domain = GiroMapper.toDomain(typeormEntity);

      // Assert
      expect(domain.activo).toBe(false);
    });
  });

  describe('toTypeOrm()', () => {
    it('should convert Domain entity to TypeORM entity', () => {
      // Arrange
      const domain = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio al por mayor',
        sector: 'Mayorista',
        riesgo: 'ALTO',
      });
      (domain as any).id = '550e8400-e29b-41d4-a716-446655440000';
      (domain as any).createdAt = new Date('2026-01-15T10:00:00Z');
      (domain as any).updatedAt = new Date('2026-01-15T10:30:00Z');

      // Act
      const typeorm = GiroMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm).toBeInstanceOf(GiroTypeOrmEntity);
      expect(typeorm.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(typeorm.clave).toBe('COM-001');
      expect(typeorm.descripcion).toBe('Comercio al por mayor');
      expect(typeorm.sector).toBe('Mayorista');
      expect(typeorm.riesgo).toBe('ALTO');
      expect(typeorm.activo).toBe(true);
      expect(typeorm.createdAt).toEqual(new Date('2026-01-15T10:00:00Z'));
      expect(typeorm.updatedAt).toEqual(new Date('2026-01-15T10:30:00Z'));
    });

    it('should handle null sector', () => {
      // Arrange
      const domain = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      // Act
      const typeorm = GiroMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm.sector).toBeNull();
    });

    it('should convert deactivated giro', () => {
      // Arrange
      const domain = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      domain.deactivate();

      // Act
      const typeorm = GiroMapper.toTypeOrm(domain);

      // Assert
      expect(typeorm.activo).toBe(false);
    });
  });

  describe('bidirectional conversion', () => {
    it('should preserve all fields after round-trip', () => {
      // Arrange
      const original = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio Original',
        sector: 'Retail',
        riesgo: 'ALTO',
      });
      (original as any).id = '550e8400-e29b-41d4-a716-446655440000';

      // Act
      const typeorm = GiroMapper.toTypeOrm(original);
      const converted = GiroMapper.toDomain(typeorm);

      // Assert
      expect(converted.id).toBe(original.id);
      expect(converted.clave).toBe(original.clave);
      expect(converted.descripcion).toBe(original.descripcion);
      expect(converted.sector).toBe(original.sector);
      expect(converted.riesgo).toBe(original.riesgo);
      expect(converted.activo).toBe(original.activo);
      expect(converted.createdAt).toEqual(original.createdAt);
      expect(converted.updatedAt).toEqual(original.updatedAt);
    });

    it('should preserve dates after round-trip', () => {
      // Arrange
      const original = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      const originalCreatedAt = original.createdAt;
      const originalUpdatedAt = original.updatedAt;

      // Act
      const typeorm = GiroMapper.toTypeOrm(original);
      const converted = GiroMapper.toDomain(typeorm);

      // Assert
      expect(converted.createdAt.getTime()).toBe(originalCreatedAt.getTime());
      expect(converted.updatedAt.getTime()).toBe(originalUpdatedAt.getTime());
    });
  });
});
