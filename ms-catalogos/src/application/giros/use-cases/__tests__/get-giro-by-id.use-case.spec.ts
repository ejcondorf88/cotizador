import { GetGiroByIdUseCase } from '../get-giro-by-id.use-case';
import { GiroRepositoryPort } from '../../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../../domain/giros/entities/giro.entity';
import { NotFoundException } from '@nestjs/common';

describe('Application/Giros - GetGiroByIdUseCase', () => {
  let useCase: GetGiroByIdUseCase;
  let mockRepo: jest.Mocked<GiroRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByClave: jest.fn(),
      findAll: jest.fn(),
      search: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new GetGiroByIdUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should return giro by id', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);

      // Act
      const result = await useCase.execute(giroId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(giroId);
      expect(result.clave).toBe('COM-001');
      expect(mockRepo.findById).toHaveBeenCalledWith(giroId);
    });

    it('should return giro with all fields', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        sector: 'Retail',
        riesgo: 'MEDIO',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);

      // Act
      const result = await useCase.execute(giroId);

      // Assert
      expect(result.id).toBe(giroId);
      expect(result.clave).toBe('COM-001');
      expect(result.descripcion).toBe('Comercio');
      expect(result.sector).toBe('Retail');
      expect(result.riesgo).toBe('MEDIO');
      expect(result.activo).toBe(true);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw NotFoundException when giro does not exist', async () => {
      // Arrange
      const giroId = 'non-existent';
      mockRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(giroId)).rejects.toThrow(NotFoundException);
      expect(mockRepo.findById).toHaveBeenCalledWith(giroId);
    });

    it('should return inactive giro', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      existingGiro.deactivate();
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);

      // Act
      const result = await useCase.execute(giroId);

      // Assert
      expect(result.activo).toBe(false);
    });
  });
});
