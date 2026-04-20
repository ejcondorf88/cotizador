import { QuoteMapper } from '../quote.mapper';
import { QuoteTypeOrmEntity } from '../../entities/quote.typeorm.entity';
import { Quote } from '../../../../domain/quote/entities/quote.entity';
import { QuoteStatus } from '../../../../domain/quote/enums/quote-status.enum';

describe('Infrastructure/Quote - QuoteMapper', () => {
  describe('toDomain()', () => {
    it('should map TypeORM entity to domain Quote', () => {
      // ARRANGE
      const typeOrmEntity = new QuoteTypeOrmEntity();
      typeOrmEntity.id = 'quote-123';
      typeOrmEntity.folioNumber = 'COT-2026-00001';
      typeOrmEntity.status = 'DRAFT';
      typeOrmEntity.createdAt = new Date('2026-01-15');
      typeOrmEntity.updatedAt = new Date('2026-01-15');

      // ACT
      const result = QuoteMapper.toDomain(typeOrmEntity);

      // ASSERT
      expect(result).toBeInstanceOf(Quote);
      expect(result.id).toBe('quote-123');
      expect(result.folioNumber).toBe('COT-2026-00001');
      expect(result.status).toBe(QuoteStatus.DRAFT);
      expect(result.createdAt).toEqual(new Date('2026-01-15'));
      expect(result.updatedAt).toEqual(new Date('2026-01-15'));
    });

    it('should map details when present', () => {
      // ARRANGE
      const typeOrmEntity = new QuoteTypeOrmEntity();
      typeOrmEntity.id = 'quote-123';
      typeOrmEntity.folioNumber = 'COT-2026-00001';
      typeOrmEntity.status = 'DRAFT';
      typeOrmEntity.createdAt = new Date('2026-01-15');
      typeOrmEntity.updatedAt = new Date('2026-01-15');
      typeOrmEntity.companyName = 'Test Company';
      typeOrmEntity.rfc = 'TEST123456ABC';
      typeOrmEntity.businessLine = 'Technology';
      typeOrmEntity.businessType = 'Software';
      typeOrmEntity.agentKey = 'AGENT001';
      typeOrmEntity.agentName = 'John Doe';
      typeOrmEntity.subscriber = 'Jane Smith';
      typeOrmEntity.office = 'CDMX-01';
      typeOrmEntity.validityStart = new Date('2026-01-01');
      typeOrmEntity.validityEnd = new Date('2026-12-31');
      typeOrmEntity.currency = 'MXN';
      typeOrmEntity.paymentType = 'MENSUAL';

      // ACT
      const result = QuoteMapper.toDomain(typeOrmEntity);

      // ASSERT
      expect(result.details).toBeDefined();
      expect(result.details?.companyName).toBe('Test Company');
      expect(result.details?.rfc).toBe('TEST123456ABC');
      expect(result.details?.businessLine).toBe('Technology');
      expect(result.details?.businessType).toBe('Software');
      expect(result.details?.agentKey).toBe('AGENT001');
      expect(result.details?.agentName).toBe('John Doe');
      expect(result.details?.subscriber).toBe('Jane Smith');
      expect(result.details?.office).toBe('CDMX-01');
      expect(result.details?.validityStart).toEqual(new Date('2026-01-01'));
      expect(result.details?.validityEnd).toEqual(new Date('2026-12-31'));
      expect(result.details?.currency).toBe('MXN');
      expect(result.details?.paymentType).toBe('MENSUAL');
    });

    it('should handle null companyName (no details)', () => {
      // ARRANGE
      const typeOrmEntity = new QuoteTypeOrmEntity();
      typeOrmEntity.id = 'quote-123';
      typeOrmEntity.folioNumber = 'COT-2026-00001';
      typeOrmEntity.status = 'DRAFT';
      typeOrmEntity.createdAt = new Date('2026-01-15');
      typeOrmEntity.updatedAt = new Date('2026-01-15');
      typeOrmEntity.companyName = null;

      // ACT
      const result = QuoteMapper.toDomain(typeOrmEntity);

      // ASSERT
      expect(result.details).toBeUndefined();
    });

    it('should map different statuses correctly', () => {
      // ARRANGE
      const statuses = [
        { status: 'DRAFT', expected: QuoteStatus.DRAFT },
        { status: 'IN_PROGRESS', expected: QuoteStatus.IN_PROGRESS },
        { status: 'COMPLETED', expected: QuoteStatus.COMPLETED },
        { status: 'CANCELLED', expected: QuoteStatus.CANCELLED },
      ];

      statuses.forEach(({ status, expected }) => {
        const typeOrmEntity = new QuoteTypeOrmEntity();
        typeOrmEntity.id = 'quote-123';
        typeOrmEntity.folioNumber = 'COT-2026-00001';
        typeOrmEntity.status = status;
        typeOrmEntity.createdAt = new Date();
        typeOrmEntity.updatedAt = new Date();

        // ACT
        const result = QuoteMapper.toDomain(typeOrmEntity);

        // ASSERT
        expect(result.status).toBe(expected);
      });
    });
  });

  describe('toEntity()', () => {
    it('should map domain Quote to TypeORM entity', () => {
      // ARRANGE
      const quote = new Quote(
        'quote-123',
        'COT-2026-00001',
        QuoteStatus.DRAFT,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
      );

      // ACT
      const result = QuoteMapper.toEntity(quote);

      // ASSERT
      expect(result).toBeInstanceOf(QuoteTypeOrmEntity);
      expect(result.id).toBe('quote-123');
      expect(result.folioNumber).toBe('COT-2026-00001');
      expect(result.status).toBe('DRAFT');
      expect(result.createdAt).toEqual(new Date('2026-01-15'));
      expect(result.updatedAt).toEqual(new Date('2026-01-15'));
    });

    it('should map details to TypeORM entity', () => {
      // ARRANGE
      const quote = new Quote(
        'quote-123',
        'COT-2026-00001',
        QuoteStatus.DRAFT,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
        {
          companyName: 'Test Company',
          rfc: 'TEST123456ABC',
          businessLine: 'Technology',
          businessType: 'Software',
          agentKey: 'AGENT001',
          agentName: 'John Doe',
          subscriber: 'Jane Smith',
          office: 'CDMX-01',
          validityStart: new Date('2026-01-01'),
          validityEnd: new Date('2026-12-31'),
          currency: 'MXN',
          paymentType: 'MENSUAL',
        },
      );

      // ACT
      const result = QuoteMapper.toEntity(quote);

      // ASSERT
      expect(result.companyName).toBe('Test Company');
      expect(result.rfc).toBe('TEST123456ABC');
      expect(result.businessLine).toBe('Technology');
      expect(result.businessType).toBe('Software');
      expect(result.agentKey).toBe('AGENT001');
      expect(result.agentName).toBe('John Doe');
      expect(result.subscriber).toBe('Jane Smith');
      expect(result.office).toBe('CDMX-01');
      expect(result.validityStart).toEqual(new Date('2026-01-01'));
      expect(result.validityEnd).toEqual(new Date('2026-12-31'));
      expect(result.currency).toBe('MXN');
      expect(result.paymentType).toBe('MENSUAL');
    });

    it('should handle undefined details', () => {
      // ARRANGE
      const quote = new Quote(
        'quote-123',
        'COT-2026-00001',
        QuoteStatus.DRAFT,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
        undefined,
      );

      // ACT
      const result = QuoteMapper.toEntity(quote);

      // ASSERT
      expect(result.companyName).toBeUndefined();
      expect(result.rfc).toBeUndefined();
    });

    it('should handle partial details', () => {
      // ARRANGE
      const quote = new Quote(
        'quote-123',
        'COT-2026-00001',
        QuoteStatus.DRAFT,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
        {
          companyName: 'Test Company',
          // Missing other fields
        },
      );

      // ACT
      const result = QuoteMapper.toEntity(quote);

      // ASSERT
      expect(result.companyName).toBe('Test Company');
      expect(result.rfc).toBeUndefined();
      expect(result.businessLine).toBeUndefined();
    });
  });

  describe('toResponseDto()', () => {
    it('should map Quote to response DTO', () => {
      // ARRANGE
      const quote = new Quote(
        'quote-123',
        'COT-2026-00001',
        QuoteStatus.DRAFT,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
      );

      // ACT
      const result = QuoteMapper.toResponseDto(quote);

      // ASSERT
      expect(result.id).toBe('quote-123');
      expect(result.folioNumber).toBe('COT-2026-00001');
      expect(result.status).toBe('DRAFT');
      expect(result.details).toBeUndefined();
    });

    it('should include details in response DTO when present', () => {
      // ARRANGE
      const quote = new Quote(
        'quote-123',
        'COT-2026-00001',
        QuoteStatus.DRAFT,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
        {
          companyName: 'Test Company',
          rfc: 'TEST123456ABC',
        },
      );

      // ACT
      const result = QuoteMapper.toResponseDto(quote);

      // ASSERT
      expect(result.details).toBeDefined();
      expect(result.details?.companyName).toBe('Test Company');
      expect(result.details?.rfc).toBe('TEST123456ABC');
    });

    it('should handle undefined details in response DTO', () => {
      // ARRANGE
      const quote = new Quote(
        'quote-123',
        'COT-2026-00001',
        QuoteStatus.DRAFT,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
      );

      // ACT
      const result = QuoteMapper.toResponseDto(quote);

      // ASSERT
      expect(result.details).toBeUndefined();
    });
  });

  describe('bidirectional mapping', () => {
    it('should preserve data integrity through toDomain -> toEntity cycle', () => {
      // ARRANGE
      const typeOrmEntity = new QuoteTypeOrmEntity();
      typeOrmEntity.id = 'quote-123';
      typeOrmEntity.folioNumber = 'COT-2026-00001';
      typeOrmEntity.status = 'DRAFT';
      typeOrmEntity.createdAt = new Date('2026-01-15');
      typeOrmEntity.updatedAt = new Date('2026-01-15');
      typeOrmEntity.companyName = 'Test Company';
      typeOrmEntity.rfc = 'TEST123456ABC';

      // ACT
      const domain = QuoteMapper.toDomain(typeOrmEntity);
      const backToEntity = QuoteMapper.toEntity(domain);

      // ASSERT
      expect(backToEntity.id).toBe(typeOrmEntity.id);
      expect(backToEntity.folioNumber).toBe(typeOrmEntity.folioNumber);
      expect(backToEntity.status).toBe(typeOrmEntity.status);
      expect(backToEntity.companyName).toBe(typeOrmEntity.companyName);
      expect(backToEntity.rfc).toBe(typeOrmEntity.rfc);
    });

    it('should preserve data integrity through toEntity -> toDomain cycle', () => {
      // ARRANGE
      const quote = new Quote(
        'quote-123',
        'COT-2026-00001',
        QuoteStatus.DRAFT,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
        {
          companyName: 'Test Company',
          rfc: 'TEST123456ABC',
          currency: 'MXN',
        },
      );

      // ACT
      const entity = QuoteMapper.toEntity(quote);
      const backToDomain = QuoteMapper.toDomain(entity);

      // ASSERT
      expect(backToDomain.id).toBe(quote.id);
      expect(backToDomain.folioNumber).toBe(quote.folioNumber);
      expect(backToDomain.status).toBe(quote.status);
      expect(backToDomain.details?.companyName).toBe(quote.details?.companyName);
      expect(backToDomain.details?.rfc).toBe(quote.details?.rfc);
      expect(backToDomain.details?.currency).toBe(quote.details?.currency);
    });
  });
});
