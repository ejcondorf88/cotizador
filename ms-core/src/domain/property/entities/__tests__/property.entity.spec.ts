import { Property } from '../property.entity';
import { ConstructionType } from '../../enums/construction-type.enum';
import { PropertyUsage } from '../../enums/property-usage.enum';
import { PropertyStatus } from '../../enums/property-status.enum';

describe('Domain/Property - Property Entity', () => {
  const mockAddress = {
    street: 'Av. Principal 123',
    neighborhood: 'Centro',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '01000',
  };

  const mockConstruction = {
    type: ConstructionType.CONCRETO,
    year: 2020,
    levels: 2,
    usage: PropertyUsage.COMERCIAL,
    specificActivity: 'Tienda de abarrotes',
    activityCode: '461110',
  };

  const mockCoverages = {
    building: 1000000,
    contents: 500000,
    electronicEquipment: 100000,
    machinery: 0,
    stock: 200000,
  };

  describe('create()', () => {
    it('should create a property with all required fields', () => {
      // ARRANGE & ACT
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ASSERT
      expect(property.id).toBeDefined();
      expect(property.quoteId).toBe('quote-123');
      expect(property.name).toBe('Inmueble 1');
      expect(property.address).toEqual(mockAddress);
      expect(property.construction).toEqual(mockConstruction);
      expect(property.coverages).toEqual(mockCoverages);
      expect(property.createdAt).toBeInstanceOf(Date);
      expect(property.updatedAt).toBeInstanceOf(Date);
    });

    it('should recalculate status on creation', () => {
      // ARRANGE & ACT
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ASSERT
      expect(property.completionPercentage).toBe(100);
      expect(property.status).toBe(PropertyStatus.COMPLETE);
    });
  });

  describe('createEmpty()', () => {
    it('should create an empty property with default values', () => {
      // ARRANGE & ACT
      const property = Property.createEmpty('quote-123', 1);

      // ASSERT
      expect(property.quoteId).toBe('quote-123');
      expect(property.name).toBe('Inmueble 1');
      expect(property.address.street).toBe('');
      expect(property.address.zipCode).toBe('');
      expect(property.status).toBe(PropertyStatus.INCOMPLETE);
      expect(property.completionPercentage).toBeLessThan(100);
    });
  });

  describe('recalculateStatus()', () => {
    it('should set COMPLETE status when all fields are filled', () => {
      // ARRANGE
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ASSERT
      expect(property.status).toBe(PropertyStatus.COMPLETE);
      expect(property.completionPercentage).toBe(100);
    });

    it('should set INCOMPLETE status when required fields are missing', () => {
      // ARRANGE & ACT
      const incompleteAddress = { ...mockAddress, street: '' };
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        incompleteAddress,
        mockConstruction,
        mockCoverages,
      );

      // ASSERT
      expect(property.status).toBe(PropertyStatus.INCOMPLETE);
      expect(property.completionPercentage).toBeLessThan(100);
    });

    it('should set INCOMPLETE status when zip code is invalid', () => {
      // ARRANGE & ACT
      const invalidZipAddress = { ...mockAddress, zipCode: '123' };
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        invalidZipAddress,
        mockConstruction,
        mockCoverages,
      );

      // ASSERT
      expect(property.status).toBe(PropertyStatus.INCOMPLETE);
    });

    it('should set INCOMPLETE status when no coverage is set', () => {
      // ARRANGE & ACT
      const noCoverage = {
        building: 0,
        contents: 0,
        electronicEquipment: 0,
        machinery: 0,
        stock: 0,
      };
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        noCoverage,
      );

      // ASSERT
      expect(property.status).toBe(PropertyStatus.INCOMPLETE);
    });

    it('should recalculate percentage correctly with partial fields', () => {
      // ARRANGE & ACT
      const property = Property.createEmpty('quote-123', 1);

      // Update with partial data
      property.update({
        name: 'Updated Property',
        address: { street: 'New Street', zipCode: '12345' },
      });

      // ASSERT
      expect(property.completionPercentage).toBeGreaterThan(0);
      expect(property.completionPercentage).toBeLessThan(100);
      expect(property.status).toBe(PropertyStatus.INCOMPLETE);
    });
  });

  describe('getTotalCoverage()', () => {
    it('should sum all coverage values correctly', () => {
      // ARRANGE
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ACT
      const total = property.getTotalCoverage();

      // ASSERT
      expect(total).toBe(1800000); // 1M + 500K + 100K + 0 + 200K
    });

    it('should handle zero coverages', () => {
      // ARRANGE
      const zeroCoverages = {
        building: 0,
        contents: 0,
        electronicEquipment: 0,
        machinery: 0,
        stock: 0,
      };
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        zeroCoverages,
      );

      // ACT
      const total = property.getTotalCoverage();

      // ASSERT
      expect(total).toBe(0);
    });

    it('should handle undefined/null values in coverages', () => {
      // ARRANGE
      const property = Property.createEmpty('quote-123', 1);
      
      // ACT
      const total = property.getTotalCoverage();

      // ASSERT
      expect(total).toBe(0);
    });
  });

  describe('update()', () => {
    it('should update only provided address fields', () => {
      // ARRANGE
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ACT
      property.update({
        address: { street: 'New Street 456' },
      });

      // ASSERT
      expect(property.address.street).toBe('New Street 456');
      expect(property.address.city).toBe('Ciudad de México'); // Unchanged
    });

    it('should update only provided construction fields', () => {
      // ARRANGE
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ACT
      property.update({
        construction: { levels: 5 },
      });

      // ASSERT
      expect(property.construction.levels).toBe(5);
      expect(property.construction.type).toBe(ConstructionType.CONCRETO); // Unchanged
    });

    it('should update only provided coverage fields', () => {
      // ARRANGE
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ACT
      property.update({
        coverages: { building: 2000000 },
      });

      // ASSERT
      expect(property.coverages.building).toBe(2000000);
      expect(property.coverages.contents).toBe(500000); // Unchanged
    });

    it('should update name independently', () => {
      // ARRANGE
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ACT
      property.update({
        name: 'Sucursal Principal',
      });

      // ASSERT
      expect(property.name).toBe('Sucursal Principal');
    });

    it('should recalculate status after update', () => {
      // ARRANGE
      const property = Property.createEmpty('quote-123', 1);
      expect(property.status).toBe(PropertyStatus.INCOMPLETE);

      // ACT - Complete all fields
      property.update({
        name: 'Complete Property',
        address: mockAddress,
        construction: mockConstruction,
        coverages: mockCoverages,
      });

      // ASSERT
      expect(property.status).toBe(PropertyStatus.COMPLETE);
      expect(property.completionPercentage).toBe(100);
    });

    it('should update timestamp after modification', () => {
      // ARRANGE
      const property = Property.createEmpty('quote-123', 1);
      const initialUpdatedAt = property.updatedAt;

      // ACT
      property.update({ name: 'Updated' });

      // ASSERT
      expect(property.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });
  });

  describe('isComplete()', () => {
    it('should return true for complete property', () => {
      // ARRANGE
      const property = Property.create(
        'quote-123',
        'Inmueble 1',
        mockAddress,
        mockConstruction,
        mockCoverages,
      );

      // ASSERT
      expect(property.isComplete()).toBe(true);
    });

    it('should return false for incomplete property', () => {
      // ARRANGE
      const property = Property.createEmpty('quote-123', 1);

      // ASSERT
      expect(property.isComplete()).toBe(false);
    });
  });
});
