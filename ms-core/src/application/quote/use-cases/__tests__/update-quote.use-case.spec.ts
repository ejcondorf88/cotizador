import { UpdateQuoteUseCase } from '../update-quote.use-case';
import { QuoteRepositoryPort } from '../../../../domain/quote/ports/quote.repository.port';
import { Quote } from '../../../../domain/quote/entities/quote.entity';
import { QuoteStatus } from '../../../../domain/quote/enums/quote-status.enum';
import { StructuredLogger } from '../../../../common/logger/logger.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Application/Quote - UpdateQuoteUseCase', () => {
  let useCase: UpdateQuoteUseCase;
  let mockRepository: jest.Mocked<QuoteRepositoryPort>;
  let mockLogger: jest.Mocked<StructuredLogger>;

  const mockQuote = {
    id: 'quote-123',
    folioNumber: 'COT-2026-00001',
    status: QuoteStatus.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
    details: undefined,
  } as unknown as Quote;

  beforeEach(() => {
    // ARRANGE - Create mocks
    mockRepository = {
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

    useCase = new UpdateQuoteUseCase(mockRepository, mockLogger);
  });

  describe('execute()', () => {
    it('should update quote with company details', async () => {
      // ARRANGE
      const input = {
        id: 'quote-123',
        companyName: 'Test Corp',
        rfc: 'TEST123456ABC',
      };

      const updatedQuote = {
        ...mockQuote,
        details: {
          companyName: 'Test Corp',
          rfc: 'TEST123456ABC',
        },
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.update.mockResolvedValue(updatedQuote as Quote);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result.details?.companyName).toBe('Test Corp');
      expect(result.details?.rfc).toBe('TEST123456ABC');
      expect(mockRepository.findById).toHaveBeenCalledWith('quote-123');
      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        'application',
        'UpdateQuoteUseCase',
        'USE_CASE_SUCCESS',
        expect.any(String),
        expect.any(Object),
        expect.any(Number),
      );
    });

    it('should update quote status', async () => {
      // ARRANGE
      const input = {
        id: 'quote-123',
        status: QuoteStatus.IN_PROGRESS,
      };

      const updatedQuote = {
        ...mockQuote,
        status: QuoteStatus.IN_PROGRESS,
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.update.mockResolvedValue(updatedQuote as Quote);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result.status).toBe(QuoteStatus.IN_PROGRESS);
    });

    it('should update validity dates', async () => {
      // ARRANGE
      const validityStart = new Date('2026-01-01');
      const validityEnd = new Date('2026-12-31');
      const input = {
        id: 'quote-123',
        validityStart,
        validityEnd,
      };

      const updatedQuote = {
        ...mockQuote,
        details: {
          validityStart,
          validityEnd,
        },
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.update.mockResolvedValue(updatedQuote as Quote);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result.details?.validityStart).toEqual(validityStart);
      expect(result.details?.validityEnd).toEqual(validityEnd);
    });

    it('should throw NotFoundException when quote does not exist', async () => {
      // ARRANGE
      const input = {
        id: 'non-existent',
        companyName: 'Test Corp',
      };

      mockRepository.findById.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'application',
        'UpdateQuoteUseCase',
        'QUOTE_NOT_FOUND',
        expect.any(String),
        { quoteId: 'non-existent' },
      );
    });

    it('should throw BadRequestException when validityEnd is before validityStart', async () => {
      // ARRANGE
      const input = {
        id: 'quote-123',
        validityStart: new Date('2026-12-31'),
        validityEnd: new Date('2026-01-01'),
      };

      mockRepository.findById.mockResolvedValue(mockQuote);

      // ACT & ASSERT
      await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
      await expect(useCase.execute(input)).rejects.toThrow('validityEnd must be after validityStart');
    });

    it('should update only provided fields (partial update)', async () => {
      // ARRANGE
      const input = {
        id: 'quote-123',
        companyName: 'Only This Field',
      };

      const updatedQuote = {
        ...mockQuote,
        details: {
          companyName: 'Only This Field',
        },
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.update.mockResolvedValue(updatedQuote as Quote);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result.details?.companyName).toBe('Only This Field');
      expect(mockRepository.update).toHaveBeenCalledWith(
        'quote-123',
        expect.objectContaining({
          details: expect.objectContaining({
            companyName: 'Only This Field',
          }),
        }),
      );
    });

    it('should update agent information', async () => {
      // ARRANGE
      const input = {
        id: 'quote-123',
        agentKey: 'AGENT001',
        agentName: 'John Doe',
        subscriber: 'Jane Smith',
        office: 'CDMX-01',
      };

      const updatedQuote = {
        ...mockQuote,
        details: {
          agentKey: 'AGENT001',
          agentName: 'John Doe',
          subscriber: 'Jane Smith',
          office: 'CDMX-01',
        },
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.update.mockResolvedValue(updatedQuote as Quote);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result.details?.agentKey).toBe('AGENT001');
      expect(result.details?.agentName).toBe('John Doe');
      expect(result.details?.subscriber).toBe('Jane Smith');
      expect(result.details?.office).toBe('CDMX-01');
    });

    it('should update currency and payment type', async () => {
      // ARRANGE
      const input = {
        id: 'quote-123',
        currency: 'USD' as const,
        paymentType: 'MENSUAL' as const,
      };

      const updatedQuote = {
        ...mockQuote,
        details: {
          currency: 'USD',
          paymentType: 'MENSUAL',
        },
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.update.mockResolvedValue(updatedQuote as Quote);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result.details?.currency).toBe('USD');
      expect(result.details?.paymentType).toBe('MENSUAL');
    });

    it('should log error on repository failure', async () => {
      // ARRANGE
      const input = {
        id: 'quote-123',
        companyName: 'Test Corp',
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.update.mockRejectedValue(new Error('Database error'));

      // ACT & ASSERT
      await expect(useCase.execute(input)).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        'application',
        'UpdateQuoteUseCase',
        'USE_CASE_ERROR',
        expect.any(String),
        expect.any(Error),
        { quoteId: 'quote-123' },
      );
    });

    it('should update property count', async () => {
      // ARRANGE
      const input = {
        id: 'quote-123',
        propertyCount: 5,
      };

      const updatedQuote = {
        ...mockQuote,
        propertyCount: 5,
      };

      mockRepository.findById.mockResolvedValue(mockQuote);
      mockRepository.update.mockResolvedValue(updatedQuote as Quote);

      // ACT
      const result = await useCase.execute(input);

      // ASSERT
      expect(result.propertyCount).toBe(5);
    });
  });
});
