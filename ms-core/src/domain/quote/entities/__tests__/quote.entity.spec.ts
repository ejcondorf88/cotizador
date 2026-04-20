import { Quote } from '../quote.entity';
import { QuoteStatus } from '../../enums/quote-status.enum';

describe('Domain/Quote - Quote Entity', () => {
  describe('create()', () => {
    it('should create a quote with provided folio number', () => {
      // ARRANGE
      const folioNumber = 'COT-2026-00001';

      // ACT
      const quote = Quote.create(folioNumber);

      // ASSERT
      expect(quote.id).toBeDefined();
      expect(quote.folioNumber).toBe('COT-2026-00001');
      expect(quote.status).toBe(QuoteStatus.DRAFT);
      expect(quote.createdAt).toBeInstanceOf(Date);
      expect(quote.updatedAt).toBeInstanceOf(Date);
    });

    it('should create quotes with unique IDs', () => {
      // ARRANGE & ACT
      const quote1 = Quote.create('COT-2026-00001');
      const quote2 = Quote.create('COT-2026-00002');

      // ASSERT
      expect(quote1.id).not.toBe(quote2.id);
    });
  });

  describe('updateDetails()', () => {
    it('should update only provided fields', () => {
      // ARRANGE
      const quote = Quote.create('COT-2026-00001');
      const initialUpdatedAt = quote.updatedAt;

      // ACT
      quote.updateDetails({
        companyName: 'Test Corp',
      });

      // ASSERT
      expect(quote.details?.companyName).toBe('Test Corp');
      expect(quote.status).toBe(QuoteStatus.DRAFT);
      expect(quote.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });

    it('should merge new details with existing ones', () => {
      // ARRANGE
      const quote = Quote.create('COT-2026-00001');
      quote.updateDetails({ companyName: 'Test Corp', rfc: 'TEST123456' });

      // ACT
      quote.updateDetails({ businessLine: 'Technology' });

      // ASSERT
      expect(quote.details?.companyName).toBe('Test Corp');
      expect(quote.details?.rfc).toBe('TEST123456');
      expect(quote.details?.businessLine).toBe('Technology');
    });

    it('should update all detail fields', () => {
      // ARRANGE
      const quote = Quote.create('COT-2026-00001');
      const validityStart = new Date('2026-01-01');
      const validityEnd = new Date('2026-12-31');

      // ACT
      quote.updateDetails({
        companyName: 'SeguraX Corp',
        rfc: 'SEX123456ABC',
        businessLine: 'Insurance',
        businessType: 'Services',
        agentKey: 'AGENT001',
        agentName: 'John Doe',
        subscriber: 'Jane Smith',
        office: 'CDMX-01',
        validityStart,
        validityEnd,
        currency: 'MXN',
        paymentType: 'MENSUAL',
      });

      // ASSERT
      expect(quote.details).toMatchObject({
        companyName: 'SeguraX Corp',
        rfc: 'SEX123456ABC',
        businessLine: 'Insurance',
        businessType: 'Services',
        agentKey: 'AGENT001',
        agentName: 'John Doe',
        subscriber: 'Jane Smith',
        office: 'CDMX-01',
        validityStart,
        validityEnd,
        currency: 'MXN',
        paymentType: 'MENSUAL',
      });
    });
  });

  describe('changeStatus()', () => {
    it('should change status from DRAFT to IN_PROGRESS', () => {
      // ARRANGE
      const quote = Quote.create('COT-2026-00001');
      const initialUpdatedAt = quote.updatedAt;

      // ACT
      quote.changeStatus(QuoteStatus.IN_PROGRESS);

      // ASSERT
      expect(quote.status).toBe(QuoteStatus.IN_PROGRESS);
      expect(quote.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });

    it('should change status from IN_PROGRESS to COMPLETED', () => {
      // ARRANGE
      const quote = Quote.create('COT-2026-00001');
      quote.changeStatus(QuoteStatus.IN_PROGRESS);

      // ACT
      quote.changeStatus(QuoteStatus.COMPLETED);

      // ASSERT
      expect(quote.status).toBe(QuoteStatus.COMPLETED);
    });

    it('should allow status to be CANCELLED from any state', () => {
      // ARRANGE
      const quote = Quote.create('COT-2026-00001');

      // ACT
      quote.changeStatus(QuoteStatus.CANCELLED);

      // ASSERT
      expect(quote.status).toBe(QuoteStatus.CANCELLED);
    });
  });

  describe('setPropertyCount()', () => {
    it('should set property count', () => {
      // ARRANGE
      const quote = Quote.create('COT-2026-00001');

      // ACT
      quote.setPropertyCount(5);

      // ASSERT
      expect(quote.propertyCount).toBe(5);
    });

    it('should update timestamp when setting property count', () => {
      // ARRANGE
      const quote = Quote.create('COT-2026-00001');
      const initialUpdatedAt = quote.updatedAt;

      // ACT
      quote.setPropertyCount(3);

      // ASSERT
      expect(quote.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });
  });
});
