import { Giro } from '../../src/domain/giros/entities/giro.entity';

export const girosFixtures = {
  validGiro: {
    clave: 'COM-001',
    descripcion: 'Comercio al por mayor',
    sector: 'Mayorista',
    riesgo: 'MEDIO',
    activo: true,
  },

  validGiroMin: {
    clave: 'MIN-001',
    descripcion: 'Giro mínimo',
  },

  giroAltoRiesgo: {
    clave: 'HIGH-001',
    descripcion: 'Comercio de químicos',
    sector: 'Química',
    riesgo: 'ALTO',
  },

  giroBajoRiesgo: {
    clave: 'LOW-001',
    descripcion: 'Oficina administrativa',
    sector: 'Servicios',
    riesgo: 'BAJO',
  },

  giroForUpdate: {
    clave: 'UPDATE-001',
    descripcion: 'Giro para actualizar',
    sector: 'Original',
  },

  createGiroEntities(count: number): Giro[] {
    return Array.from({ length: count }, (_, i) =>
      Giro.create({
        clave: `GIRO-${i.toString().padStart(3, '0')}`,
        descripcion: `Giro de prueba ${i}`,
        sector: 'Test',
        riesgo: 'MEDIO',
      }),
    );
  },
};
