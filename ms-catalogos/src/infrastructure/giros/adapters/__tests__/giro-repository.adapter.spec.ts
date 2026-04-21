import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { GiroRepositoryAdapter } from '../giro-repository.adapter';
import { GiroTypeOrmEntity } from '../../entities/giro.typeorm.entity';
import { Giro } from '../../../../domain/giros/entities/giro.entity';

describe('Infrastructure/Giros - GiroRepositoryAdapter (Integration)', () => {
  let container: any;
  let module: TestingModule;
  let repository: GiroRepositoryAdapter;
  let dataSource: DataSource;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('test_catalogos')
      .withUsername('test')
      .withPassword('test')
      .start();

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getPort(),
          username: 'test',
          password: 'test',
          database: 'test_catalogos',
          entities: [GiroTypeOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([GiroTypeOrmEntity]),
      ],
      providers: [GiroRepositoryAdapter],
    }).compile();

    repository = module.get<GiroRepositoryAdapter>(GiroRepositoryAdapter);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  beforeEach(async () => {
    await dataSource.getRepository(GiroTypeOrmEntity).clear();
  });

  describe('create()', () => {
    it('should persist giro with UUID', async () => {
      // Arrange
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio al por mayor',
      });

      // Act
      const saved = await repository.create(giro);

      // Assert
      expect(saved.id).toBeDefined();
      expect(saved.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(saved.clave).toBe('COM-001');
      expect(saved.descripcion).toBe('Comercio al por mayor');
    });

    it('should persist giro with all fields', async () => {
      // Arrange
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        sector: 'Retail',
        riesgo: 'ALTO',
      });

      // Act
      const saved = await repository.create(giro);

      // Assert
      expect(saved.clave).toBe('COM-001');
      expect(saved.descripcion).toBe('Comercio');
      expect(saved.sector).toBe('Retail');
      expect(saved.riesgo).toBe('ALTO');
      expect(saved.activo).toBe(true);
    });
  });

  describe('findById()', () => {
    it('should return giro by id', async () => {
      // Arrange
      const giro = Giro.create({ clave: 'COM-001', descripcion: 'Test' });
      const saved = await repository.create(giro);

      // Act
      const found = await repository.findById(saved.id);

      // Assert
      expect(found).toBeDefined();
      expect(found?.clave).toBe('COM-001');
    });

    it('should return null if not found', async () => {
      // Act
      const found = await repository.findById('non-existent-uuid');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findByClave()', () => {
    it('should return giro by clave exact match', async () => {
      // Arrange
      const giro = Giro.create({ clave: 'COM-001', descripcion: 'Test' });
      await repository.create(giro);

      // Act
      const found = await repository.findByClave('COM-001');

      // Assert
      expect(found).toBeDefined();
      expect(found?.clave).toBe('COM-001');
    });

    it('should return null for non-existent clave', async () => {
      // Act
      const found = await repository.findByClave('NON-EXISTENT');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findAll()', () => {
    it('should return paginated list', async () => {
      // Arrange
      await repository.create(Giro.create({ clave: 'A', descripcion: 'Test A' }));
      await repository.create(Giro.create({ clave: 'B', descripcion: 'Test B' }));

      // Act
      const result = await repository.findAll({ page: 1, limit: 10 });

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should return only active giros', async () => {
      // Arrange
      const active = Giro.create({ clave: 'ACTIVE', descripcion: 'Active' });
      const inactive = Giro.create({ clave: 'INACTIVE', descripcion: 'Inactive' });
      inactive.deactivate();
      await repository.create(active);
      await repository.create(inactive);

      // Act
      const result = await repository.findAll({ page: 1, limit: 10 });

      // Assert - Only active should be returned
      expect(result.items).toHaveLength(1);
      expect(result.items[0].clave).toBe('ACTIVE');
    });
  });

  describe('search()', () => {
    it('should find by description partial match', async () => {
      // Arrange
      await repository.create(Giro.create({ clave: 'A', descripcion: 'Comercio de Alimentos' }));
      await repository.create(Giro.create({ clave: 'B', descripcion: 'Comercio de Ropa' }));
      await repository.create(Giro.create({ clave: 'C', descripcion: 'Servicios' }));

      // Act
      const result = await repository.search('Comercio', { page: 1, limit: 10 });

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should be case-insensitive', async () => {
      // Arrange
      await repository.create(Giro.create({ clave: 'A', descripcion: 'COMERCIO MAYORISTA' }));

      // Act
      const result = await repository.search('comercio', { page: 1, limit: 10 });

      // Assert
      expect(result.items).toHaveLength(1);
    });
  });

  describe('update()', () => {
    it('should update specific fields', async () => {
      // Arrange
      const giro = Giro.create({ clave: 'COM-001', descripcion: 'Original', sector: 'Old' });
      const saved = await repository.create(giro);

      // Update entity
      saved.update({ descripcion: 'Updated' });

      // Act
      const updated = await repository.update(saved.id, saved);

      // Assert
      expect(updated.descripcion).toBe('Updated');
      expect(updated.sector).toBe('Old'); // Unchanged
      expect(updated.clave).toBe('COM-001'); // Unchanged
    });
  });

  describe('delete()', () => {
    it('should perform soft delete', async () => {
      // Arrange
      const giro = Giro.create({ clave: 'DEL-001', descripcion: 'To Delete' });
      const saved = await repository.create(giro);

      // Act
      await repository.delete(saved.id);

      // Assert
      const found = await repository.findById(saved.id);
      expect(found?.activo).toBe(false);
    });

    it('should not physically delete record', async () => {
      // Arrange
      const giro = Giro.create({ clave: 'DEL-001', descripcion: 'To Delete' });
      const saved = await repository.create(giro);

      // Act
      await repository.delete(saved.id);

      // Assert - Record still exists but is inactive
      const allInDb = await dataSource.getRepository(GiroTypeOrmEntity).find();
      expect(allInDb).toHaveLength(1);
      expect(allInDb[0].activo).toBe(false);
    });
  });
});
