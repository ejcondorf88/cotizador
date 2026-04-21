import { CreateAgenteUseCase } from '../create-agente.use-case';
import { AgenteRepositoryPort } from '../../../../domain/agentes/ports/agente.repository.port';
import { Agente } from '../../../../domain/agentes/entities/agente.entity';
import { CreateAgenteDto } from '../../dto/create-agente.dto';
import { ConflictException } from '@nestjs/common';

describe('Application/Agentes - CreateAgenteUseCase', () => {
  let useCase: CreateAgenteUseCase;
  let mockRepo: jest.Mocked<AgenteRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCodigo: jest.fn(),
      findAll: jest.fn(),
      search: jest.fn(),
      findByOficina: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new CreateAgenteUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should create agente successfully', async () => {
      // Arrange
      const dto: CreateAgenteDto = {
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        email: 'agente@test.com',
        telefono: '555-1234',
        oficinaId: 'oficina-uuid-001',
      };

      mockRepo.findByCodigo.mockResolvedValue(null);
      mockRepo.create.mockImplementation(async (agente: Agente) => agente);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.codigo).toBe('AGT-001');
      expect(result.nombre).toBe('Agente Test');
      expect(result.email).toBe('agente@test.com');
      expect(result.telefono).toBe('555-1234');
      expect(result.oficinaId).toBe('oficina-uuid-001');
      expect(mockRepo.findByCodigo).toHaveBeenCalledWith('AGT-001');
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('should create agente with minimum required fields', async () => {
      // Arrange
      const dto: CreateAgenteDto = {
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      };

      mockRepo.findByCodigo.mockResolvedValue(null);
      mockRepo.create.mockImplementation(async (agente: Agente) => agente);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.codigo).toBe('AGT-001');
      expect(result.nombre).toBe('Agente Test');
      expect(result.email).toBeNull();
      expect(result.telefono).toBeNull();
      expect(result.oficinaId).toBeNull();
    });

    it('should throw ConflictException when codigo already exists', async () => {
      // Arrange
      const dto: CreateAgenteDto = {
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      };

      const existingAgente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Existente',
      });

      mockRepo.findByCodigo.mockResolvedValue(existingAgente);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
      await expect(useCase.execute(dto)).rejects.toThrow('Ya existe un agente con el código');
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('should set activo=true by default', async () => {
      // Arrange
      const dto: CreateAgenteDto = {
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      };

      mockRepo.findByCodigo.mockResolvedValue(null);
      mockRepo.create.mockImplementation(async (agente: Agente) => agente);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.activo).toBe(true);
    });

    it('should call repository.create with correct entity', async () => {
      // Arrange
      const dto: CreateAgenteDto = {
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        email: 'test@test.com',
      };

      mockRepo.findByCodigo.mockResolvedValue(null);
      let savedEntity: Agente | undefined;
      mockRepo.create.mockImplementation(async (agente: Agente) => {
        savedEntity = agente;
        return agente;
      });

      // Act
      await useCase.execute(dto);

      // Assert
      expect(savedEntity).toBeDefined();
      expect(savedEntity!.codigo).toBe('AGT-001');
      expect(savedEntity!.nombre).toBe('Agente Test');
      expect(savedEntity!.email).toBe('test@test.com');
      expect(savedEntity!.id).toBeDefined();
    });
  });
});
