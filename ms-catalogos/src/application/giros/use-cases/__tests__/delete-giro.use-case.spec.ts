import { DeleteGiroUseCase } from '../delete-giro.use-case';
import { GiroRepositoryPort } from '../../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../../domain/giros/entities/giro.entity';
import { NotFoundException } from '@nestjs/common';

describe('Application/Giros - DeleteGiroUseCase', () => {
  let useCase: DeleteGiroUseCase;
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

    useCase = new DeleteGiroUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should delete giro successfully (soft delete)', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);
      mockRepo.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(giroId);

      // Assert
      expect(mockRepo.findById).toHaveBeenCalledWith(giroId);
      expect(mockRepo.delete).toHaveBeenCalledWith(giroId);
    });

    it('should throw NotFoundException when giro does not exist', async () => {
      // Arrange
      const giroId = 'non-existent';
      mockRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(giroId)).rejects.toThrow(NotFoundException);
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });

    it('should call repository.delete with correct id', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);
      mockRepo.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(giroId);

      // Assert
      expect(mockRepo.delete).toHaveBeenCalledTimes(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(giroId);
    });

    it('should handle already inactive giro', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      existingGiro.deactivate();
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);
      mockRepo.delete.mockResolvedValue(undefined);

      // Act
      await useCase.execute(giroId);

      // Assert
      expect(mockRepo.delete).toHaveBeenCalledWith(giroId);
    });
  });
});
