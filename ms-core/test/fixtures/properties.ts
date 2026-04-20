/**
 * Property Test Fixtures
 *
 * Datos de prueba reutilizables para tests de Properties.
 * Sigue el patrón Factory para crear instancias de prueba.
 */

import { Property, PropertyAddress, ConstructionDetails, PropertyCoverages } from '../../src/domain/property/entities/property.entity';
import { ConstructionType } from '../../src/domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../src/domain/property/enums/property-usage.enum';
import { PropertyStatus } from '../../src/domain/property/enums/property-status.enum';

/**
 * Factory function para crear una Property básica
 */
export const createPropertyFixture = (
  overrides: Partial<{
    id: string;
    quoteId: string;
    name: string;
    address: PropertyAddress;
    construction: ConstructionDetails;
    coverages: PropertyCoverages;
    status: PropertyStatus;
    completionPercentage: number;
  }> = {},
): Property => {
  const id = overrides.id ?? 'property-uuid-123';
  const quoteId = overrides.quoteId ?? 'quote-uuid-456';
  const now = new Date();

  const address: PropertyAddress = overrides.address ?? {
    street: 'Av. Principal 123',
    neighborhood: 'Centro',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '01000',
  };

  const construction: ConstructionDetails = overrides.construction ?? {
    type: ConstructionType.CONCRETO,
    usage: PropertyUsage.COMERCIAL,
    specificActivity: 'Oficinas',
    year: 2020,
    levels: 2,
  };

  const coverages: PropertyCoverages = overrides.coverages ?? {
    building: 1000000,
    contents: 500000,
    electronicEquipment: 200000,
    machinery: 0,
    stock: 100000,
  };

  return new Property(
    id,
    quoteId,
    overrides.name ?? 'Inmueble de Prueba',
    address,
    construction,
    coverages,
    overrides.status ?? PropertyStatus.COMPLETE,
    overrides.completionPercentage ?? 100,
    now,
    now,
  );
};

/**
 * Factory para crear propiedades vacías/incompletas
 */
export const createEmptyPropertyFixture = (
  quoteId: string = 'quote-uuid-456',
  index: number = 1,
): Property => {
  const now = new Date();

  return new Property(
    `property-uuid-${index}`,
    quoteId,
    `Inmueble ${index}`,
    {
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    {
      type: ConstructionType.CONCRETO,
      usage: PropertyUsage.COMERCIAL,
      specificActivity: '',
    },
    {
      building: 0,
      contents: 0,
      electronicEquipment: 0,
      machinery: 0,
      stock: 0,
    },
    PropertyStatus.INCOMPLETE,
    0,
    now,
    now,
  );
};

/**
 * Addresses de ejemplo
 */
export const addressFixtures = {
  complete: {
    street: 'Av. Insurgentes Sur 1000',
    neighborhood: 'Del Valle',
    city: 'Ciudad de México',
    state: 'CDMX',
    zipCode: '03100',
  } as PropertyAddress,
  minimal: {
    street: 'Calle Test',
    neighborhood: 'Colonia Test',
    city: 'Ciudad Test',
    state: 'EST',
    zipCode: '12345',
  } as PropertyAddress,
  incomplete: {
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  } as PropertyAddress,
  invalidZip: {
    street: 'Calle Test',
    neighborhood: 'Colonia Test',
    city: 'Ciudad Test',
    state: 'EST',
    zipCode: 'invalid',
  } as PropertyAddress,
};

/**
 * Construction details de ejemplo
 */
export const constructionFixtures = {
  complete: {
    type: ConstructionType.CONCRETO,
    year: 2020,
    levels: 3,
    usage: PropertyUsage.COMERCIAL,
    specificActivity: 'Consultoría',
    activityCode: '5411',
  } as ConstructionDetails,
  minimal: {
    type: ConstructionType.MIXTA,
    usage: PropertyUsage.INDUSTRIAL,
    specificActivity: 'Bodega',
  } as ConstructionDetails,
  incomplete: {
    type: ConstructionType.CONCRETO,
    usage: PropertyUsage.COMERCIAL,
    specificActivity: '',
  } as ConstructionDetails,
};

/**
 * Coverages de ejemplo
 */
export const coverageFixtures = {
  full: {
    building: 5000000,
    contents: 2000000,
    electronicEquipment: 1000000,
    machinery: 500000,
    stock: 1000000,
  } as PropertyCoverages,
  minimal: {
    building: 100000,
    contents: 0,
    electronicEquipment: 0,
    machinery: 0,
    stock: 0,
  } as PropertyCoverages,
  empty: {
    building: 0,
    contents: 0,
    electronicEquipment: 0,
    machinery: 0,
    stock: 0,
  } as PropertyCoverages,
  onlyBuilding: {
    building: 1000000,
    contents: 0,
    electronicEquipment: 0,
    machinery: 0,
    stock: 0,
  } as PropertyCoverages,
};

/**
 * Datos para DTOs de creación
 */
export const createPropertyDtoFixture = {
  complete: {
    name: 'Oficinas Corporativas',
    address: addressFixtures.complete,
    construction: constructionFixtures.complete,
    coverages: coverageFixtures.full,
  },
  minimal: {
    name: 'Bodega Simple',
    address: addressFixtures.minimal,
    construction: constructionFixtures.minimal,
    coverages: coverageFixtures.minimal,
  },
  invalidZip: {
    name: 'Propiedad con CP Inválido',
    address: addressFixtures.invalidZip,
    construction: constructionFixtures.complete,
    coverages: coverageFixtures.full,
  },
};

/**
 * Datos para DTOs de actualización
 */
export const updatePropertyDtoFixture = {
  valid: {
    name: 'Nuevo Nombre del Inmueble',
    address: {
      street: 'Nueva Calle 456',
    },
    coverages: {
      building: 2000000,
    },
  },
  partial: {
    coverages: {
      electronicEquipment: 500000,
    },
  },
  empty: {},
  invalidValues: {
    coverages: {
      building: -1000,
      contents: -500,
    },
  },
};

/**
 * Array de Properties para tests de listado
 */
export const propertiesListFixture: Property[] = [
  createPropertyFixture({
    id: 'prop-1',
    quoteId: 'quote-001',
    name: 'Inmueble 1',
    status: PropertyStatus.COMPLETE,
    completionPercentage: 100,
  }),
  createPropertyFixture({
    id: 'prop-2',
    quoteId: 'quote-001',
    name: 'Inmueble 2',
    status: PropertyStatus.INCOMPLETE,
    completionPercentage: 50,
    address: addressFixtures.incomplete,
  }),
  createPropertyFixture({
    id: 'prop-3',
    quoteId: 'quote-002',
    name: 'Inmueble 3',
    status: PropertyStatus.COMPLETE,
    completionPercentage: 100,
  }),
];

/**
 * Fixtures para bulk creation
 */
export const bulkCreatePropertiesFixture = {
  count3: { count: 3 },
  count5: { count: 5 },
  count0: { count: 0 },
  countNegative: { count: -1 },
};

/**
 * IDs de ejemplo para tests
 */
export const propertyIdsFixture = {
  existing: 'property-existing-uuid',
  nonExisting: 'property-non-existing-uuid',
  invalid: 'invalid-id',
};

/**
 * IDs de quote para tests
 */
export const quoteIdsForPropertiesFixture = {
  withProperties: 'quote-with-properties',
  withoutProperties: 'quote-without-properties',
  nonExisting: 'quote-non-existing',
};
