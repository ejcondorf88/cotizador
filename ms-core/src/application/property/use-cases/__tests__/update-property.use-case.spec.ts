import { UpdatePropertyUseCase } from '../update-property.use-case';
import { PropertyRepositoryPort } from '../../../../domain/property/ports/property.repository.port';
import { Property } from '../../../../domain/property/entities/property.entity';
import { PropertyStatus } from '../../../../domain/property/enums/property-status.enum';
import { ConstructionType } from '../../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../../domain/property/enums/property-usage.enum';
import { StructuredLogger } from '../../../../common/logger/logger.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Application/Property - UpdatePropertyUseCase', () => {
  let useCase: UpdatePropertyUseCase;
  let mockPropertyRepository: jest.Mocked<PropertyRepositoryPort>;
  let mockLogger: jest.Mocked<StructuredLogger>;

  const mockProperty = Property.create(
    'quote-123',
    'Inmueble 1',
    {
      street: 'Av. Principal 123',
      neighborhood: 'Centro',
      city: 'Ciudad de México',
      state: 'CDMX',
      zipCode: '01000',
    },
    {
      type: ConstructionType.CONCRETO,
      usage: PropertyUsage.COMERCIAL,
      specificActivity: 'Tienda de abarrotes',
    },
    {
      building: 1000000,
      contents: 500000,
      electronicEquipment: 100000,
      machinery: 0,
      stock: 200000,
    },
  );

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

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<StructuredLogger>;

    useCase = new UpdatePropertyUseCase(mockPropertyRepository, mockLogger);
  });

  describe('execute()', () => {
    it('should update property name and address', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);
      mockPropertyRepository.update.mockImplementation((id, data) => {
        const updated = Property.create(
          mockProperty.quoteId,
          data.name ?? mockProperty.name,
          data.address ?? mockProperty.address,
          data.construction ?? mockProperty.construction,
          data.coverages ?? mockProperty.coverages,
        );
        return Promise.resolve(updated);
      });

      // ACT
      const result = await useCase.execute({
        id: 'prop-123',
        name: 'Updated Property',
        street: 'New Street',
      });

      // ASSERT
      expect(result.name).toBe('Updated Property');
      expect(result.address.street).toBe('New Street');
      expect(mockPropertyRepository.findById).toHaveBeenCalledWith('prop-123');
      expect(mockPropertyRepository.update).toHaveBeenCalledWith(
        'prop-123',
        expect.objectContaining({
          name: 'Updated Property',
          address: expect.any(Object),
        }),
      );
    });

    it('should update construction details', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);
      mockPropertyRepository.update.mockImplementation((id, data) => {
        const updated = Property.create(
          mockProperty.quoteId,
          data.name ?? mockProperty.name,
          data.address ?? mockProperty.address,
          data.construction ?? mockProperty.construction,
          data.coverages ?? mockProperty.coverages,
        );
        return Promise.resolve(updated);
      });

      // ACT
      const result = await useCase.execute({
        id: 'prop-123',
        constructionType: ConstructionType.ACERO,
        constructionYear: 2020,
        levels: 3,
        propertyUsage: PropertyUsage.INDUSTRIAL,
      });

      // ASSERT
      expect(result.construction.type).toBe(ConstructionType.ACERO);
      expect(result.construction.year).toBe(2020);
      expect(result.construction.levels).toBe(3);
      expect(result.construction.usage).toBe(PropertyUsage.INDUSTRIAL);
    });

    it('should update coverage values', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);
      mockPropertyRepository.update.mockImplementation((id, data) => {
        const updated = Property.create(
          mockProperty.quoteId,
          data.name ?? mockProperty.name,
          data.address ?? mockProperty.address,
          data.construction ?? mockProperty.construction,
          data.coverages ?? mockProperty.coverages,
        );
        return Promise.resolve(updated);
      });

      // ACT
      const result = await useCase.execute({
        id: 'prop-123',
        coverageBuilding: 2000000,
        coverageContents: 1000000,
        coverageElectronic: 500000,
        coverageMachinery: 300000,
        coverageStock: 400000,
      });

      // ASSERT
      expect(result.coverages.building).toBe(2000000);
      expect(result.coverages.contents).toBe(1000000);
      expect(result.coverages.electronicEquipment).toBe(500000);
    });

    it('should throw NotFoundException when property does not exist', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'non-existent' })).rejects.toThrow(NotFoundException);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'application',
        'UpdatePropertyUseCase',
        'PROPERTY_NOT_FOUND',
        expect.any(String),
        { propertyId: 'non-existent' },
      );
    });

    it('should throw BadRequestException when zip code is invalid', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', zipCode: '1234' })).rejects.toThrow(BadRequestException);
      await expect(useCase.execute({ id: 'prop-123', zipCode: '1234' })).rejects.toThrow('Zip code must be exactly 5 digits');
    });

    it('should throw BadRequestException when zip code has letters', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', zipCode: 'ABCDE' })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when construction year is before 1900', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', constructionYear: 1800 })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when construction year is in the future', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);
      const currentYear = new Date().getFullYear();

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', constructionYear: currentYear + 1 })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when coverage building is negative', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', coverageBuilding: -1000 })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when coverage exceeds maximum', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', coverageBuilding: 200000000 })).rejects.toThrow(BadRequestException);
      await expect(useCase.execute({ id: 'prop-123', coverageBuilding: 200000000 })).rejects.toThrow('Maximum building coverage');
    });

    it('should throw BadRequestException when contents coverage exceeds maximum', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', coverageContents: 60000000 })).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when electronic coverage exceeds maximum', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', coverageElectronic: 30000000 })).rejects.toThrow(BadRequestException);
    });

    it('should log success after update', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);
      mockPropertyRepository.update.mockImplementation((id, data) => {
        const updated = Property.create(
          mockProperty.quoteId,
          data.name ?? mockProperty.name,
          data.address ?? mockProperty.address,
          data.construction ?? mockProperty.construction,
          data.coverages ?? mockProperty.coverages,
        );
        return Promise.resolve(updated);
      });

      // ACT
      await useCase.execute({ id: 'prop-123', name: 'Updated' });

      // ASSERT
      expect(mockLogger.info).toHaveBeenCalledWith(
        'application',
        'UpdatePropertyUseCase',
        'USE_CASE_SUCCESS',
        expect.any(String),
        expect.objectContaining({
          propertyId: 'prop-123',
          status: expect.any(String),
        }),
      );
    });

    it('should log error on repository failure', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);
      mockPropertyRepository.update.mockRejectedValue(new Error('Database error'));

      // ACT & ASSERT
      await expect(useCase.execute({ id: 'prop-123', name: 'Updated' })).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        'application',
        'UpdatePropertyUseCase',
        'USE_CASE_ERROR',
        expect.any(String),
        expect.any(Error),
        { propertyId: 'prop-123' },
      );
    });

    it('should pass correct data to repository update', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);
      mockPropertyRepository.update.mockImplementation((id, data) => {
        const updated = Property.create(
          mockProperty.quoteId,
          data.name ?? mockProperty.name,
          data.address ?? mockProperty.address,
          data.construction ?? mockProperty.construction,
          data.coverages ?? mockProperty.coverages,
        );
        return Promise.resolve(updated);
      });

      // ACT
      await useCase.execute({
        id: 'prop-123',
        name: 'New Name',
        city: 'New City',
        constructionYear: 2020,
        coverageBuilding: 1500000,
      });

      // ASSERT
      expect(mockPropertyRepository.update).toHaveBeenCalledWith(
        'prop-123',
        expect.objectContaining({
          name: 'New Name',
          address: expect.any(Object),
          construction: expect.any(Object),
          coverages: expect.any(Object),
        }),
      );
    });

    it('should handle partial updates', async () => {
      // ARRANGE
      mockPropertyRepository.findById.mockResolvedValue(mockProperty);
      mockPropertyRepository.update.mockImplementation((id, data) => {
        const updated = Property.create(
          mockProperty.quoteId,
          data.name ?? mockProperty.name,
          data.address ?? mockProperty.address,
          data.construction ?? mockProperty.construction,
          data.coverages ?? mockProperty.coverages,
        );
        return Promise.resolve(updated);
      });

      // ACT - Update only name
      const result = await useCase.execute({
        id: 'prop-123',
        name: 'Only Name Updated',
      });

      // ASSERT
      expect(result.name).toBe('Only Name Updated');
      expect(result.address.street).toBe(mockProperty.address.street); // Unchanged
    });
  });
});
