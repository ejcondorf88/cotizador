import { SearchAgentesUseCase } from '../search-agentes.use-case';
import { AgenteRepositoryPort } from '../../../../domain/agentes/ports/agente.repository.port';
import { Agente } from '../../../../domain/agentes/entities/agente.entity';
import { SearchDto } from '../../../common/dto/search.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('Application/Agentes - SearchAgentesUseCase', () => {
  let useCase: SearchAgentesUseCase;
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

    useCase = new SearchAgentesUseCase(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should search agentes by query', async () => {
      // Arrange
      const searchDto: SearchDto = { q: 'Juan' };
      const pagination: PaginationDto = { page: 1, limit: 10 };

      const agentes = [
        Agente.create({ codigo: 'AGT-001', nombre: 'Juan Pérez' }),
        Agente.create({ codigo: 'AGT-002', nombre: 'Juan García' }),
      ];

      mockRepo.search.mockResolvedValue({
        items: agentes,
        total: 2,
      });

      // Act
      const result = await useCase.execute(searchDto, pagination);

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockRepo.search).toHaveBeenCalledWith('Juan', { page: 1, limit: 10 });
    });

    it('should search by codigo', async () => {
      // Arrange
      const searchDto: SearchDto = { q: 'AGT-001' };
      const pagination: PaginationDto = { page: 1, limit: 10 };

      const agentes = [
        Agente.create({ codigo: 'AGT-001', nombre: 'Test' }),
      ];

      mockRepo.search.mockResolvedValue({
        items: agentes,
        total: 1,
      });

      // Act
      const result = await useCase.execute(searchDto, pagination);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].codigo).toBe('AGT-001');
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
      const agentes = [
        Agente.create({ codigo: 'AGT-001', nombre: 'Agente 1' }),
      ];

      mockRepo.search.mockResolvedValue({
        items: agentes,
        total: 15,
      });

      const searchDto: SearchDto = { q: 'Agente' };
      const pagination: PaginationDto = { page: 2, limit: 5 };

      // Act
      const result = await useCase.execute(searchDto, pagination);

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(15);
      expect(mockRepo.search).toHaveBeenCalledWith('Agente', { page: 2, limit: 5 });
    });
  });
});
