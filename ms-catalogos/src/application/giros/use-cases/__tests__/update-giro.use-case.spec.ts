import { UpdateGiroUseCase } from '../update-giro.use-case';
import { GiroRepositoryPort } from '../../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../../domain/giros/entities/giro.entity';
import { UpdateGiroDto } from '../../dto/update-giro.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('Application/Giros - UpdateGiroUseCase', () => {
  let useCase: UpdateGiroUseCase;
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

    useCase = new UpdateGiroUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should update giro successfully', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const dto: UpdateGiroDto = {
        descripcion: 'Nueva descripción',
      };

      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Descripción original',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);
      mockRepo.findByClave.mockResolvedValue(null);
      mockRepo.update.mockImplementation(async (id: string, giro: Giro) => giro);

      // Act
      const result = await useCase.execute(giroId, dto);

      // Assert
      expect(result.descripcion).toBe('Nueva descripción');
      expect(result.clave).toBe('COM-001'); // No cambió
      expect(mockRepo.findById).toHaveBeenCalledWith(giroId);
      expect(mockRepo.update).toHaveBeenCalled();
    });

    it('should update multiple fields', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const dto: UpdateGiroDto = {
        descripcion: 'Nueva descripción',
        riesgo: 'ALTO',
        sector: 'Nuevo sector',
      };

      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Original',
        sector: 'Viejo',
        riesgo: 'BAJO',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);
      mockRepo.findByClave.mockResolvedValue(null);
      mockRepo.update.mockImplementation(async (id: string, giro: Giro) => giro);

      // Act
      const result = await useCase.execute(giroId, dto);

      // Assert
      expect(result.descripcion).toBe('Nueva descripción');
      expect(result.riesgo).toBe('ALTO');
      expect(result.sector).toBe('Nuevo sector');
    });

    it('should throw NotFoundException when giro does not exist', async () => {
      // Arrange
      const giroId = 'non-existent';
      const dto: UpdateGiroDto = { descripcion: 'Nueva' };

      mockRepo.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(giroId, dto)).rejects.toThrow(NotFoundException);
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('should update clave with conflict validation', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const dto: UpdateGiroDto = {
        clave: 'COM-NEW',
      };

      const existingGiro = Giro.create({
        clave: 'COM-OLD',
        descripcion: 'Test',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);
      mockRepo.findByClave.mockResolvedValue(null); // No existe otro con la nueva clave
      mockRepo.update.mockImplementation(async (id: string, giro: Giro) => giro);

      // Act
      const result = await useCase.execute(giroId, dto);

      // Assert
      expect(result.clave).toBe('COM-NEW');
    });

    it('should throw ConflictException when updating to existing clave', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const dto: UpdateGiroDto = {
        clave: 'COM-EXISTING',
      };

      const existingGiro = Giro.create({
        clave: 'COM-OLD',
        descripcion: 'Test',
      });
      (existingGiro as any).id = giroId;

      const anotherGiro = Giro.create({
        clave: 'COM-EXISTING',
        descripcion: 'Otro giro',
      });
      (anotherGiro as any).id = 'otro-id';

      mockRepo.findById.mockResolvedValue(existingGiro);
      mockRepo.findByClave.mockResolvedValue(anotherGiro); // Ya existe otro con esta clave

      // Act & Assert
      await expect(useCase.execute(giroId, dto)).rejects.toThrow(ConflictException);
    });

    it('should allow keeping same clave on update', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const dto: UpdateGiroDto = {
        clave: 'COM-001',
        descripcion: 'Actualizado',
      };

      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Original',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);
      // findByClave retorna el mismo giro (no hay conflicto porque es el mismo)
      mockRepo.findByClave.mockResolvedValue(existingGiro);
      mockRepo.update.mockImplementation(async (id: string, giro: Giro) => giro);

      // Act
      const result = await useCase.execute(giroId, dto);

      // Assert
      expect(result.clave).toBe('COM-001');
      expect(result.descripcion).toBe('Actualizado');
    });

    it('should deactivate giro', async () => {
      // Arrange
      const giroId = 'giro-uuid-123';
      const dto: UpdateGiroDto = {
        activo: false,
      };

      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Test',
      });
      (existingGiro as any).id = giroId;

      mockRepo.findById.mockResolvedValue(existingGiro);
      mockRepo.findByClave.mockResolvedValue(null);
      mockRepo.update.mockImplementation(async (id: string, giro: Giro) => giro);

      // Act
      const result = await useCase.execute(giroId, dto);

      // Assert
      expect(result.activo).toBe(false);
    });
  });
});
