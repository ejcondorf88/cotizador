import { CreatePropertiesBulkUseCase } from '../create-properties-bulk.use-case';
import { PropertyRepositoryPort } from '../../../../domain/property/ports/property.repository.port';
import { QuoteRepositoryPort } from '../../../../domain/quote/ports/quote.repository.port';
import { Property } from '../../../../domain/property/entities/property.entity';
import { PropertyStatus } from '../../../../domain/property/enums/property-status.enum';
import { Quote } from '../../../../domain/quote/entities/quote.entity';
import { QuoteStatus } from '../../../../domain/quote/enums/quote-status.enum';
import { StructuredLogger } from '../../../../common/logger/logger.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Application/Property - CreatePropertiesBulkUseCase', () => {
  let useCase: CreatePropertiesBulkUseCase;
  let mockPropertyRepository: jest.Mocked<PropertyRepositoryPort>;
  let mockQuoteRepository: jest.Mocked<QuoteRepositoryPort>;
  let mockLogger: jest.Mocked<StructuredLogger>;

  const mockQuote = {
    id: 'quote-123',
    folioNumber: 'COT-2026-00001',
    status: QuoteStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Quote;

  beforeEach(() => {
    // ARRANGE - Create mocks
    mockPropertyRepository = {
      findById: jest.fn(),
      findByQuoteId: jest.fn(),
      create: jest.fn(),
      createBulk: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
      deleteByQuoteId: jest.fn(),
    } as unknown as jest.Mocked<PropertyRepositoryPort>;

    mockQuoteRepository = {
      create: jest.fn(),
      createWithFolioNumber: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      update: jest.fn(),
      getLastFolioOfYear: jest.fn(),
    } as unknown as jest.Mocked<QuoteRepositoryPort>;

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<StructuredLogger>;

    useCase = new CreatePropertiesBulkUseCase(
      mockPropertyRepository,
      mockQuoteRepository,
      mockLogger,
    );
  });

  describe('execute()', () => {
    it('should create N empty properties for existing quote', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 3 };
      const createdProperties = [
        { id: 'prop-1', quoteId: 'quote-123', name: 'Inmueble 1', status: PropertyStatus.INCOMPLETE },
        { id: 'prop-2', quoteId: 'quote-123', name: 'Inmueble 2', status: PropertyStatus.INCOMPLETE },
        { id: 'prop-3', quoteId: 'quote-123', name: 'Inmueble 3', status: PropertyStatus.INCOMPLETE },
      ] as Property[];

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);
      mockPropertyRepository.findByQuoteId.mockResolvedValue([]);
      mockPropertyRepository.createBulk.mockResolvedValue(createdProperties);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Inmueble 1');
      expect(result[1].name).toBe('Inmueble 2');
      expect(result[2].name).toBe('Inmueble 3');
      expect(result.every(p => p.quoteId === 'quote-123')).toBe(true);
      expect(mockPropertyRepository.createBulk).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Inmueble 1' }),
          expect.objectContaining({ name: 'Inmueble 2' }),
          expect.objectContaining({ name: 'Inmueble 3' }),
        ])
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'application',
        'CreatePropertiesBulkUseCase',
        'USE_CASE_SUCCESS',
        expect.any(String),
        { quoteId: 'quote-123', count: 3 },
      );
    });

    it('should create exactly N properties with correct quoteId', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-456', count: 5 };

      mockQuoteRepository.findById.mockResolvedValue({
        ...mockQuote,
        id: 'quote-456',
      } as Quote);
      mockPropertyRepository.findByQuoteId.mockResolvedValue([]);
      mockPropertyRepository.createBulk.mockImplementation(async (props) => props as Property[]);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result).toHaveLength(5);
      expect(result.every(p => p.quoteId === 'quote-456')).toBe(true);
    });

    it('should throw NotFoundException when quote does not exist', async () => {
      // ARRANGE
      const input = { quoteId: 'non-existent', count: 3 };

      mockQuoteRepository.findById.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(input)).rejects.toThrow('Quote with id non-existent not found');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'application',
        'CreatePropertiesBulkUseCase',
        'QUOTE_NOT_FOUND',
        expect.any(String),
        { quoteId: 'non-existent' },
      );
    });

    it('should throw BadRequestException when count is less than 1', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 0 };

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);

      // ACT & ASSERT
      await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(input)).rejects.toThrow('Count must be between 1 and 100');
    });

    it('should throw BadRequestException when count is greater than 100', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 101 };

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);

      // ACT & ASSERT
      await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(input)).rejects.toThrow('Count must be between 1 and 100');
    });

    it('should throw BadRequestException when quote already has properties', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 3 };
      const existingProperties = [{ id: 'existing-1' }] as Property[];

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);
      mockPropertyRepository.findByQuoteId.mockResolvedValue(existingProperties);

      // ACT & ASSERT
      await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(input)).rejects.toThrow('Quote already has 1 properties. Delete them first.');
    });

    it('should create properties with INCOMPLETE status', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 2 };

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);
      mockPropertyRepository.findByQuoteId.mockResolvedValue([]);
      mockPropertyRepository.createBulk.mockImplementation(async (props) => {
        return props.map((p, i) => ({
          ...p,
          id: `prop-${i + 1}`,
          status: PropertyStatus.INCOMPLETE,
          completionPercentage: 0,
        })) as Property[];
      });

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result.every(p => p.status === PropertyStatus.INCOMPLETE)).toBe(true);
    });

    it('should log error on repository failure', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 3 };

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);
      mockPropertyRepository.findByQuoteId.mockResolvedValue([]);
      mockPropertyRepository.createBulk.mockRejectedValue(new Error('Database error'));

      // ACT & ASSERT
      await expect(useCase.execute(input)).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        'application',
        'CreatePropertiesBulkUseCase',
        'USE_CASE_ERROR',
        expect.any(String),
        expect.any(Error),
        { quoteId: 'quote-123', count: 3 },
      );
    });

    it('should handle count of 1 (minimum valid)', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 1 };

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);
      mockPropertyRepository.findByQuoteId.mockResolvedValue([]);
      mockPropertyRepository.createBulk.mockResolvedValue([
        { id: 'prop-1', name: 'Inmueble 1', quoteId: 'quote-123' } as Property,
      ]);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Inmueble 1');
    });

    it('should handle count of 100 (maximum valid)', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 100 };

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);
      mockPropertyRepository.findByQuoteId.mockResolvedValue([]);
      mockPropertyRepository.createBulk.mockImplementation(async (props) => {
        return props.map((p, i) => ({
          ...p,
          id: `prop-${i + 1}`,
        })) as Property[];
      });

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result).toHaveLength(100);
    });

    it('should log use case start', async () => {
      // ARRANGE
      const input = { quoteId: 'quote-123', count: 3 };

      mockQuoteRepository.findById.mockResolvedValue(mockQuote);
      mockPropertyRepository.findByQuoteId.mockResolvedValue([]);
      mockPropertyRepository.createBulk.mockResolvedValue([]);

      // ACT
      await useCase.execute(input);

      // ASSERT
      expect(mockLogger.info).toHaveBeenCalledWith(
        'application',
        'CreatePropertiesBulkUseCase',
        'USE_CASE_START',
        expect.any(String),
        { quoteId: 'quote-123', count: 3 },
      );
    });
  });
});
