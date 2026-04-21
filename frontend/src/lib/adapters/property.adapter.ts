import type { Property, UpdatePropertyRequest } from '../../types/property';
import { ConstructionType, PropertyUsage } from '../../types/property';
import type { PropertyFormData } from '../../schemas/property.schema';

/**
 * Construye los valores por defecto del formulario de inmueble
 * a partir de una propiedad existente del API.
 */
export function buildPropertyDefaultValues(property: Property): PropertyFormData {
  return {
    // Ubicación
    name: property.name || '',
    street: property.address?.street || '',
    neighborhood: property.address?.neighborhood || '',
    city: property.address?.city || '',
    state: property.address?.state || '',
    zipCode: property.address?.zipCode || '',

    // Construcción
    constructionType: property.construction?.type ?? ConstructionType.CONCRETO,
    constructionYear: property.construction?.year,
    levels: property.construction?.levels ?? 1,
    propertyUsage: property.construction?.usage ?? PropertyUsage.COMERCIAL,
    specificActivity: property.construction?.specificActivity || '',
    activityCode: property.construction?.activityCode,

    // Garantías
    coverageBuilding: property.coverages?.building ?? 0,
    coverageContents: property.coverages?.contents ?? 0,
    coverageElectronic: property.coverages?.electronicEquipment ?? 0,
    coverageMachinery: property.coverages?.machinery ?? 0,
    coverageStock: property.coverages?.stock ?? 0,
  };
}

/**
 * Transforma los datos del formulario de inmueble al request del API.
 * Adapter puro: sin lógica de negocio, sin efectos secundarios.
 */
export function toUpdatePropertyRequest(data: PropertyFormData): UpdatePropertyRequest {
  return {
    name: data.name,
    street: data.street,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    constructionType: data.constructionType,
    constructionYear: data.constructionYear,
    levels: data.levels,
    propertyUsage: data.propertyUsage,
    specificActivity: data.specificActivity,
    activityCode: data.activityCode,
    coverageBuilding: data.coverageBuilding,
    coverageContents: data.coverageContents,
    coverageElectronic: data.coverageElectronic,
    coverageMachinery: data.coverageMachinery,
    coverageStock: data.coverageStock,
  };
}
