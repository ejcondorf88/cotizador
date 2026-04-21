import { GetGirosUseCase } from '../get-giros.use-case';
import { GiroRepositoryPort } from '../../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../../domain/giros/entities/giro.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('Application/Giros - GetGirosUseCase', () => {
  let useCase: GetGirosUseCase;
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

    useCase = new GetGirosUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should return paginated list of giros', async () => {
      // Arrange
      const pagination: PaginationDto = { page: 1, limit: 10 };

      const giros = [
        Giro.create({ clave: 'COM-001', descripcion: 'Giro 1' }),
        Giro.create({ clave: 'COM-002', descripcion: 'Giro 2' }),
      ];

      mockRepo.findAll.mockResolvedValue({
        items: giros,
        total: 2,
      });

      // Act
      const result = await useCase.execute(pagination);

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockRepo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should return empty list when no giros exist', async () => {
      // Arrange
      const pagination: PaginationDto = { page: 1, limit: 10 };

      mockRepo.findAll.mockResolvedValue({
        items: [],
        total: 0,
      });

      // Act
      const result = await useCase.execute(pagination);

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should return only active giros (filtered by repository)', async () => {
      // Arrange
      const activeGiro = Giro.create({ clave: 'COM-001', descripcion: 'Activo' });
      const inactiveGiro = Giro.create({ clave: 'COM-002', descripcion: 'Inactivo' });
      inactiveGiro.deactivate();

      // Repository should filter and only return active
      mockRepo.findAll.mockResolvedValue({
        items: [activeGiro],
        total: 1,
      });

      const pagination: PaginationDto = { page: 1, limit: 10 };

      // Act
      const result = await useCase.execute(pagination);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].clave).toBe('COM-001');
    });

    it('should handle pagination correctly', async () => {
      // Arrange
      const giros = Array.from({ length: 5 }, (_, i) =>
        Giro.create({
          clave: `COM-${String(i + 1).padStart(3, '0')}`,
          descripcion: `Giro ${i + 1}`,
        })
      );

      mockRepo.findAll.mockResolvedValue({
        items: giros,
        total: 25,
      });

      const pagination: PaginationDto = { page: 1, limit: 5 };

      // Act
      const result = await useCase.execute(pagination);

      // Assert
      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(25);
    });

    it('should pass correct pagination parameters', async () => {
      // Arrange
      mockRepo.findAll.mockResolvedValue({
        items: [],
        total: 0,
      });

      const pagination: PaginationDto = { page: 2, limit: 20 };

      // Act
      await useCase.execute(pagination);

      // Assert
      expect(mockRepo.findAll).toHaveBeenCalledWith({ page: 2, limit: 20 });
    });

    it('should use default values when pagination not provided', async () => {
      // Arrange
      mockRepo.findAll.mockResolvedValue({
        items: [],
        total: 0,
      });

      // Act
      await useCase.execute({} as PaginationDto);

      // Assert
      expect(mockRepo.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 });
    });
  });
});
