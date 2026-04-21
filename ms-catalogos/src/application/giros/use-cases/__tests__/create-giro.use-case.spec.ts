import { CreateGiroUseCase } from '../create-giro.use-case';
import { GiroRepositoryPort } from '../../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../../domain/giros/entities/giro.entity';
import { CreateGiroDto } from '../../dto/create-giro.dto';
import { GiroResponseDto } from '../../dto/giro-response.dto';

describe('Application/Giros - CreateGiroUseCase', () => {
  let useCase: CreateGiroUseCase;
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

    useCase = new CreateGiroUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should create giro successfully with valid data', async () => {
      // Arrange
      const dto: CreateGiroDto = {
        clave: 'COM-001',
        descripcion: 'Comercio al por mayor',
        sector: 'Mayorista',
        riesgo: 'MEDIO',
      };

      mockRepo.findByClave.mockResolvedValue(null);
      mockRepo.create.mockImplementation(async (giro: Giro) => {
        return giro;
      });

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.clave).toBe('COM-001');
      expect(result.descripcion).toBe('Comercio al por mayor');
      expect(result.riesgo).toBe('MEDIO');
      expect(result.activo).toBe(true);
      expect(mockRepo.findByClave).toHaveBeenCalledWith('COM-001');
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('should create giro with default risk level MEDIO', async () => {
      // Arrange
      const dto: CreateGiroDto = {
        clave: 'COM-001',
        descripcion: 'Comercio',
      };

      mockRepo.findByClave.mockResolvedValue(null);
      mockRepo.create.mockImplementation(async (giro: Giro) => giro);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.riesgo).toBe('MEDIO');
    });

    it('should create giro with custom risk level', async () => {
      // Arrange
      const dto: CreateGiroDto = {
        clave: 'COM-001',
        descripcion: 'Comercio',
        riesgo: 'ALTO',
      };

      mockRepo.findByClave.mockResolvedValue(null);
      mockRepo.create.mockImplementation(async (giro: Giro) => giro);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.riesgo).toBe('ALTO');
    });

    it('should throw ConflictException when clave already exists', async () => {
      // Arrange
      const dto: CreateGiroDto = {
        clave: 'COM-001',
        descripcion: 'Comercio',
      };

      const existingGiro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Giro existente',
      });

      mockRepo.findByClave.mockResolvedValue(existingGiro);

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow('Ya existe un giro con la clave');
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('should create giro with all fields provided', async () => {
      // Arrange
      const dto: CreateGiroDto = {
        clave: 'COM-001',
        descripcion: 'Comercio al por mayor',
        sector: 'Mayorista',
        riesgo: 'BAJO',
        activo: false,
      };

      mockRepo.findByClave.mockResolvedValue(null);
      mockRepo.create.mockImplementation(async (giro: Giro) => giro);

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.clave).toBe('COM-001');
      expect(result.descripcion).toBe('Comercio al por mayor');
      expect(result.sector).toBe('Mayorista');
      expect(result.riesgo).toBe('BAJO');
      expect(result.activo).toBe(false);
    });

    it('should call repository.create with correct entity', async () => {
      // Arrange
      const dto: CreateGiroDto = {
        clave: 'COM-001',
        descripcion: 'Comercio',
      };

      mockRepo.findByClave.mockResolvedValue(null);
      let savedEntity: Giro | undefined;
      mockRepo.create.mockImplementation(async (giro: Giro) => {
        savedEntity = giro;
        return giro;
      });

      // Act
      await useCase.execute(dto);

      // Assert
      expect(savedEntity).toBeDefined();
      expect(savedEntity!.clave).toBe('COM-001');
      expect(savedEntity!.descripcion).toBe('Comercio');
      expect(savedEntity!.id).toBeDefined();
    });
  });
});
