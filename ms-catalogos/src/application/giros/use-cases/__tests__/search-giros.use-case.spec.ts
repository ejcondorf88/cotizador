import { SearchGirosUseCase } from '../search-giros.use-case';
import { GiroRepositoryPort } from '../../../../domain/giros/ports/giro.repository.port';
import { Giro } from '../../../../domain/giros/entities/giro.entity';
import { SearchDto } from '../../../common/dto/search.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('Application/Giros - SearchGirosUseCase', () => {
  let useCase: SearchGirosUseCase;
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

    useCase = new SearchGirosUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should search giros by query', async () => {
      // Arrange
      const searchDto: SearchDto = { q: 'Comercio' };
      const pagination: PaginationDto = { page: 1, limit: 10 };

      const giros = [
        Giro.create({ clave: 'COM-001', descripcion: 'Comercio al por mayor' }),
        Giro.create({ clave: 'COM-002', descripcion: 'Comercio al por menor' }),
      ];

      mockRepo.search.mockResolvedValue({
        items: giros,
        total: 2,
      });

      // Act
      const result = await useCase.execute(searchDto, pagination);

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockRepo.search).toHaveBeenCalledWith('Comercio', { page: 1, limit: 10 });
    });

    it('should return empty list when no matches found', async () => {
      // Arrange
      const searchDto: SearchDto = { q: 'XYZ' };
      const pagination: PaginationDto = { page: 1, limit: 10 };

      mockRepo.search.mockResolvedValue({
        items: [],
        total: 0,
      });

      // Act
      const result = await useCase.execute(searchDto, pagination);

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should search with pagination', async () => {
      // Arrange
      const giros = [
        Giro.create({ clave: 'COM-001', descripcion: 'Comercio 1' }),
      ];

      mockRepo.search.mockResolvedValue({
        items: giros,
        total: 15,
      });

      const searchDto: SearchDto = { q: 'Comercio' };
      const pagination: PaginationDto = { page: 2, limit: 5 };

      // Act
      const result = await useCase.execute(searchDto, pagination);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(15);
      expect(mockRepo.search).toHaveBeenCalledWith('Comercio', { page: 2, limit: 5 });
    });

    it('should use default values when not provided', async () => {
      // Arrange
      mockRepo.search.mockResolvedValue({
        items: [],
        total: 0,
      });

      const searchDto: SearchDto = { q: 'test' };
      const pagination: PaginationDto = {} as PaginationDto;

      // Act
      await useCase.execute(searchDto, pagination);

      // Assert
      expect(mockRepo.search).toHaveBeenCalledWith('test', { page: 1, limit: 20 });
    });

    it('should perform case-insensitive search', async () => {
      // Arrange
      const giros = [
        Giro.create({ clave: 'COM-001', descripcion: 'COMERCIO MAYORISTA' }),
      ];

      mockRepo.search.mockResolvedValue({
        items: giros,
        total: 1,
      });

      const searchDto: SearchDto = { q: 'comercio' };
      const pagination: PaginationDto = { page: 1, limit: 10 };

      // Act
      const result = await useCase.execute(searchDto, pagination);

      // Assert
      expect(result.items).toHaveLength(1);
    });
  });
});
