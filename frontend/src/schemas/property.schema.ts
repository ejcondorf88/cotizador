import { z } from 'zod';
import { ConstructionType, PropertyUsage } from '../types/property';

const CURRENT_YEAR = new Date().getFullYear();

export const propertySchema = z
  .object({
    // Ubicación
    name: z.string().min(1, 'El nombre del inmueble es obligatorio'),
    street: z.string().min(1, 'La calle y número son obligatorios'),
    neighborhood: z
      .string()
      .min(1, 'La colonia es obligatoria')
      .refine((v) => !/^\d+$/.test(v), 'La colonia no puede ser solo números'),
    city: z
      .string()
      .min(1, 'La ciudad es obligatoria')
      .max(100, 'La ciudad es demasiado larga (máx 100 caracteres)')
      .refine((v) => !/^\d+$/.test(v), 'La ciudad no puede ser solo números'),
    state: z.string().min(1, 'El estado es obligatorio'),
    zipCode: z.string().regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),

    // Construcción
    constructionType: z.nativeEnum(ConstructionType, {
      required_error: 'Seleccione el tipo de construcción',
    }),
    constructionYear: z
      .number()
      .int()
      .min(1900, 'El año debe ser mayor a 1900')
      .max(CURRENT_YEAR, `El año no puede ser mayor a ${CURRENT_YEAR}`)
      .optional(),
    levels: z.number().int().min(1, 'Debe tener al menos 1 nivel').default(1),
    propertyUsage: z.nativeEnum(PropertyUsage, {
      required_error: 'Seleccione el uso del inmueble',
    }),
    specificActivity: z.string().min(1, 'El giro específico es obligatorio'),
    activityCode: z.string().optional(),

    // Garantías
    coverageBuilding: z.number().min(0).default(0),
    coverageContents: z.number().min(0).default(0),
    coverageElectronic: z.number().min(0).default(0),
    coverageMachinery: z.number().min(0).default(0),
    coverageStock: z.number().min(0).default(0),
  })
  .refine(
    (d) =>
      [
        d.coverageBuilding,
        d.coverageContents,
        d.coverageElectronic,
        d.coverageMachinery,
        d.coverageStock,
      ].some((v) => v > 0),
    {
      message: 'Debe especificar al menos una garantía con valor mayor a 0',
      path: ['coverageBuilding'],
    }
  );

// Tipo inferido del schema — zod es la fuente de verdad
export type PropertyFormData = z.infer<typeof propertySchema>;

// Fields por step para usar con trigger() de RHF
export const PROPERTY_STEP_FIELDS = {
  0: ['name', 'street', 'neighborhood', 'city', 'state', 'zipCode'],
  1: ['constructionType', 'constructionYear', 'levels', 'propertyUsage', 'specificActivity'],
  2: ['coverageBuilding', 'coverageContents', 'coverageElectronic', 'coverageMachinery', 'coverageStock'],
} satisfies Record<number, (keyof PropertyFormData)[]>;
