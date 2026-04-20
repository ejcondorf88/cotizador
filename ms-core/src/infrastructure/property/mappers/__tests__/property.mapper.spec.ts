import { PropertyMapper } from '../property.mapper';
import { PropertyTypeOrmEntity } from '../../entities/property.typeorm.entity';
import { Property, PropertyAddress, ConstructionDetails, PropertyCoverages } from '../../../../domain/property/entities/property.entity';
import { ConstructionType } from '../../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../../domain/property/enums/property-usage.enum';
import { PropertyStatus } from '../../../../domain/property/enums/property-status.enum';

describe('Infrastructure/Property - PropertyMapper', () => {
  const mockAddress: PropertyAddress = {
    street: 'Av. Principal 123',
    neighborhood: 'Centro',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '01000',
  };

  const mockConstruction: ConstructionDetails = {
    type: ConstructionType.CONCRETO,
    year: 2020,
    levels: 2,
    usage: PropertyUsage.COMERCIAL,
    specificActivity: 'Tienda de abarrotes',
    activityCode: '461110',
  };

  const mockCoverages: PropertyCoverages = {
    building: 1000000,
    contents: 500000,
    electronicEquipment: 100000,
    machinery: 0,
    stock: 200000,
  };

  describe('toDomain()', () => {
    it('should map TypeORM entity to domain Property', () => {
      // ARRANGE
      const typeOrmEntity = new PropertyTypeOrmEntity();
      typeOrmEntity.id = 'prop-123';
      typeOrmEntity.quoteId = 'quote-456';
      typeOrmEntity.name = 'Test Property';
      typeOrmEntity.street = 'Av. Principal 123';
      typeOrmEntity.neighborhood = 'Centro';
      typeOrmEntity.city = 'Ciudad de México';
      typeOrmEntity.state = 'CDMX';
      typeOrmEntity.zipCode = '01000';
      typeOrmEntity.constructionType = ConstructionType.CONCRETO;
      typeOrmEntity.constructionYear = 2020;
      typeOrmEntity.levels = 2;
      typeOrmEntity.propertyUsage = PropertyUsage.COMERCIAL;
      typeOrmEntity.specificActivity = 'Tienda de abarrotes';
      typeOrmEntity.activityCode = '461110';
      typeOrmEntity.coverageBuilding = 1000000;
      typeOrmEntity.coverageContents = 500000;
      typeOrmEntity.coverageElectronic = 100000;
      typeOrmEntity.coverageMachinery = 0;
      typeOrmEntity.coverageStock = 200000;
      typeOrmEntity.status = PropertyStatus.COMPLETE;
      typeOrmEntity.completionPercentage = 100;
      typeOrmEntity.createdAt = new Date('2026-01-15');
      typeOrmEntity.updatedAt = new Date('2026-01-15');

      // ACT
      const result = PropertyMapper.toDomain(typeOrmEntity);

      // ASSERT
      expect(result).toBeInstanceOf(Property);
      expect(result.id).toBe('prop-123');
      expect(result.quoteId).toBe('quote-456');
      expect(result.name).toBe('Test Property');
      expect(result.address).toEqual(mockAddress);
      expect(result.construction).toEqual(expect.objectContaining(mockConstruction));
      expect(result.coverages).toEqual(mockCoverages);
      expect(result.status).toBe(PropertyStatus.COMPLETE);
      expect(result.completionPercentage).toBe(100);
    });

    it('should handle null construction year and levels', () => {
      // ARRANGE
      const typeOrmEntity = new PropertyTypeOrmEntity();
      typeOrmEntity.id = 'prop-123';
      typeOrmEntity.quoteId = 'quote-456';
      typeOrmEntity.name = 'Test Property';
      typeOrmEntity.street = 'Av. Principal 123';
      typeOrmEntity.neighborhood = 'Centro';
      typeOrmEntity.city = 'Ciudad de México';
      typeOrmEntity.state = 'CDMX';
      typeOrmEntity.zipCode = '01000';
      typeOrmEntity.constructionType = ConstructionType.CONCRETO;
      typeOrmEntity.constructionYear = null;
      typeOrmEntity.levels = null;
      typeOrmEntity.propertyUsage = PropertyUsage.COMERCIAL;
      typeOrmEntity.specificActivity = 'Tienda';
      typeOrmEntity.activityCode = null;
      typeOrmEntity.coverageBuilding = 1000000;
      typeOrmEntity.coverageContents = 0;
      typeOrmEntity.coverageElectronic = 0;
      typeOrmEntity.coverageMachinery = 0;
      typeOrmEntity.coverageStock = 0;
      typeOrmEntity.status = PropertyStatus.INCOMPLETE;
      typeOrmEntity.completionPercentage = 50;
      typeOrmEntity.createdAt = new Date();
      typeOrmEntity.updatedAt = new Date();

      // ACT
      const result = PropertyMapper.toDomain(typeOrmEntity);

      // ASSERT
      expect(result.construction.year).toBeUndefined();
      expect(result.construction.levels).toBeUndefined();
      expect(result.construction.activityCode).toBeUndefined();
    });

    it('should convert decimal coverage values to numbers', () => {
      // ARRANGE
      const typeOrmEntity = new PropertyTypeOrmEntity();
      typeOrmEntity.id = 'prop-123';
      typeOrmEntity.quoteId = 'quote-456';
      typeOrmEntity.name = 'Test';
      typeOrmEntity.street = 'Street';
      typeOrmEntity.neighborhood = 'Neighborhood';
      typeOrmEntity.city = 'City';
      typeOrmEntity.state = 'State';
      typeOrmEntity.zipCode = '12345';
      typeOrmEntity.constructionType = ConstructionType.CONCRETO;
      typeOrmEntity.propertyUsage = PropertyUsage.COMERCIAL;
      typeOrmEntity.specificActivity = 'Test';
      typeOrmEntity.coverageBuilding = 1000000.50 as any; // Simulating decimal
      typeOrmEntity.coverageContents = 500000.25 as any;
      typeOrmEntity.coverageElectronic = 0;
      typeOrmEntity.coverageMachinery = 0;
      typeOrmEntity.coverageStock = 0;
      typeOrmEntity.status = PropertyStatus.COMPLETE;
      typeOrmEntity.completionPercentage = 100;
      typeOrmEntity.createdAt = new Date();
      typeOrmEntity.updatedAt = new Date();

      // ACT
      const result = PropertyMapper.toDomain(typeOrmEntity);

      // ASSERT
      expect(typeof result.coverages.building).toBe('number');
      expect(typeof result.coverages.contents).toBe('number');
    });
  });

  describe('toEntity()', () => {
    it('should map domain Property to TypeORM entity', () => {
      // ARRANGE
      const property = new Property(
        'prop-123',
        'quote-456',
        'Test Property',
        mockAddress,
        mockConstruction,
        mockCoverages,
        PropertyStatus.COMPLETE,
        100,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
      );

      // ACT
      const result = PropertyMapper.toEntity(property);

      // ASSERT
      expect(result).toBeInstanceOf(PropertyTypeOrmEntity);
      expect(result.id).toBe('prop-123');
      expect(result.quoteId).toBe('quote-456');
      expect(result.name).toBe('Test Property');
      expect(result.street).toBe('Av. Principal 123');
      expect(result.neighborhood).toBe('Centro');
      expect(result.city).toBe('Ciudad de México');
      expect(result.state).toBe('CDMX');
      expect(result.zipCode).toBe('01000');
      expect(result.constructionType).toBe(ConstructionType.CONCRETO);
      expect(result.constructionYear).toBe(2020);
      expect(result.levels).toBe(2);
      expect(result.propertyUsage).toBe(PropertyUsage.COMERCIAL);
      expect(result.specificActivity).toBe('Tienda de abarrotes');
      expect(result.activityCode).toBe('461110');
      expect(result.coverageBuilding).toBe(1000000);
      expect(result.coverageContents).toBe(500000);
      expect(result.coverageElectronic).toBe(100000);
      expect(result.coverageMachinery).toBe(0);
      expect(result.coverageStock).toBe(200000);
      expect(result.status).toBe(PropertyStatus.COMPLETE);
      expect(result.completionPercentage).toBe(100);
    });

    it('should handle undefined construction year and activity code', () => {
      // ARRANGE
      const construction = {
        type: ConstructionType.CONCRETO,
        usage: PropertyUsage.COMERCIAL,
        specificActivity: 'Test',
        // year, levels, activityCode are undefined
      } as ConstructionDetails;

      const property = new Property(
        'prop-123',
        'quote-456',
        'Test Property',
        mockAddress,
        construction,
        mockCoverages,
        PropertyStatus.INCOMPLETE,
        50,
        new Date(),
        new Date(),
      );

      // ACT
      const result = PropertyMapper.toEntity(property);

      // ASSERT
      expect(result.constructionYear).toBeUndefined();
      expect(result.levels).toBeUndefined();
      expect(result.activityCode).toBeUndefined();
    });
  });

  describe('toDomainList()', () => {
    it('should map array of TypeORM entities to array of domain Properties', () => {
      // ARRANGE
      const entities = [
        {
          id: 'prop-1',
          quoteId: 'quote-123',
          name: 'Property 1',
          street: 'Street 1',
          neighborhood: 'Neighborhood 1',
          city: 'City 1',
          state: 'State 1',
          zipCode: '10001',
          constructionType: ConstructionType.CONCRETO,
          propertyUsage: PropertyUsage.COMERCIAL,
          specificActivity: 'Activity 1',
          coverageBuilding: 1000000,
          coverageContents: 0,
          coverageElectronic: 0,
          coverageMachinery: 0,
          coverageStock: 0,
          status: PropertyStatus.COMPLETE,
          completionPercentage: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as PropertyTypeOrmEntity,
        {
          id: 'prop-2',
          quoteId: 'quote-123',
          name: 'Property 2',
          street: 'Street 2',
          neighborhood: 'Neighborhood 2',
          city: 'City 2',
          state: 'State 2',
          zipCode: '10002',
          constructionType: ConstructionType.ACERO,
          propertyUsage: PropertyUsage.INDUSTRIAL,
          specificActivity: 'Activity 2',
          coverageBuilding: 2000000,
          coverageContents: 500000,
          coverageElectronic: 0,
          coverageMachinery: 0,
          coverageStock: 0,
          status: PropertyStatus.INCOMPLETE,
          completionPercentage: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as PropertyTypeOrmEntity,
      ];

      // ACT
      const result = PropertyMapper.toDomainList(entities);

      // ASSERT
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('prop-1');
      expect(result[0].name).toBe('Property 1');
      expect(result[1].id).toBe('prop-2');
      expect(result[1].name).toBe('Property 2');
    });

    it('should return empty array for empty input', () => {
      // ARRANGE
      const entities: PropertyTypeOrmEntity[] = [];

      // ACT
      const result = PropertyMapper.toDomainList(entities);

      // ASSERT
      expect(result).toEqual([]);
    });
  });

  describe('bidirectional mapping', () => {
    it('should preserve data integrity through toDomain -> toEntity cycle', () => {
      // ARRANGE
      const typeOrmEntity = new PropertyTypeOrmEntity();
      typeOrmEntity.id = 'prop-123';
      typeOrmEntity.quoteId = 'quote-456';
      typeOrmEntity.name = 'Test Property';
      typeOrmEntity.street = 'Av. Principal 123';
      typeOrmEntity.neighborhood = 'Centro';
      typeOrmEntity.city = 'Ciudad de México';
      typeOrmEntity.state = 'CDMX';
      typeOrmEntity.zipCode = '01000';
      typeOrmEntity.constructionType = ConstructionType.CONCRETO;
      typeOrmEntity.constructionYear = 2020;
      typeOrmEntity.levels = 2;
      typeOrmEntity.propertyUsage = PropertyUsage.COMERCIAL;
      typeOrmEntity.specificActivity = 'Tienda de abarrotes';
      typeOrmEntity.activityCode = '461110';
      typeOrmEntity.coverageBuilding = 1000000;
      typeOrmEntity.coverageContents = 500000;
      typeOrmEntity.coverageElectronic = 100000;
      typeOrmEntity.coverageMachinery = 0;
      typeOrmEntity.coverageStock = 200000;
      typeOrmEntity.status = PropertyStatus.COMPLETE;
      typeOrmEntity.completionPercentage = 100;
      typeOrmEntity.createdAt = new Date('2026-01-15');
      typeOrmEntity.updatedAt = new Date('2026-01-15');

      // ACT
      const domain = PropertyMapper.toDomain(typeOrmEntity);
      const backToEntity = PropertyMapper.toEntity(domain);

      // ASSERT
      expect(backToEntity.id).toBe(typeOrmEntity.id);
      expect(backToEntity.quoteId).toBe(typeOrmEntity.quoteId);
      expect(backToEntity.name).toBe(typeOrmEntity.name);
      expect(backToEntity.street).toBe(typeOrmEntity.street);
      expect(backToEntity.coverageBuilding).toBe(typeOrmEntity.coverageBuilding);
      expect(backToEntity.status).toBe(typeOrmEntity.status);
    });

    it('should preserve data integrity through toEntity -> toDomain cycle', () => {
      // ARRANGE
      const property = new Property(
        'prop-123',
        'quote-456',
        'Test Property',
        mockAddress,
        mockConstruction,
        mockCoverages,
        PropertyStatus.COMPLETE,
        100,
        new Date('2026-01-15'),
        new Date('2026-01-15'),
      );

      // ACT
      const entity = PropertyMapper.toEntity(property);
      const backToDomain = PropertyMapper.toDomain(entity);

      // ASSERT
      expect(backToDomain.id).toBe(property.id);
      expect(backToDomain.quoteId).toBe(property.quoteId);
      expect(backToDomain.name).toBe(property.name);
      expect(backToDomain.address).toEqual(property.address);
      expect(backToDomain.coverages).toEqual(property.coverages);
      expect(backToDomain.status).toBe(property.status);
    });
  });
});
