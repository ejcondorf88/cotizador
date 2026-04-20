import { CreateQuoteUseCase } from '../create-quote.use-case';
import { QuoteRepositoryPort } from '../../../../domain/quote/ports/quote.repository.port';
import { QuoteStatus } from '../../../../domain/quote/enums/quote-status.enum';

describe('Application/Quote - CreateQuoteUseCase', () => {
  let useCase: CreateQuoteUseCase;
  let mockRepository: jest.Mocked<QuoteRepositoryPort>;

  beforeEach(() => {
    // ARRANGE - Create mock repository
    mockRepository = {
      create: jest.fn(),
      createWithFolioNumber: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      update: jest.fn(),
      getLastFolioOfYear: jest.fn(),
    } as unknown as jest.Mocked<QuoteRepositoryPort>;

    useCase = new CreateQuoteUseCase(mockRepository);
  });

  describe('execute()', () => {
    it('should create quote with auto-generated folio', async () => {
      // ARRANGE
      const currentYear = new Date().getFullYear();
      const mockQuote = {
        id: 'uuid-123',
        folioNumber: 'COT-2026-00001',
        status: QuoteStatus.DRAFT,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockRepository.createWithFolioNumber.mockResolvedValue(mockQuote);

      // ACT
      const result = await useCase.execute();

      // ASSERT
      expect(result).toEqual(mockQuote);
      expect(mockRepository.createWithFolioNumber).toHaveBeenCalledWith(currentYear);
      expect(mockRepository.createWithFolioNumber).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository fails', async () => {
      // ARRANGE
      mockRepository.createWithFolioNumber.mockRejectedValue(new Error('Database error'));

      // ACT & ASSERT
      await expect(useCase.execute()).rejects.toThrow('Database error');
    });

    it('should propagate repository errors', async () => {
      // ARRANGE
      const dbError = new Error('Connection refused');
      mockRepository.createWithFolioNumber.mockRejectedValue(dbError);

      // ACT & ASSERT
      await expect(useCase.execute()).rejects.toEqual(dbError);
    });
  });
});
