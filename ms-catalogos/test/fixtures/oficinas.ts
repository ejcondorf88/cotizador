import { Oficina } from '../../src/domain/oficinas/entities/oficina.entity';

export const oficinasFixtures = {
  validOficina: {
    codigo: 'OF-001',
    nombre: 'Oficina Principal',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
  },

  validOficinaMin: {
    codigo: 'OF-MIN',
    nombre: 'Oficina Mínima',
  },

  oficinaSinUbicacion: {
    codigo: 'OF-NO-LOC',
    nombre: 'Oficina Sin Ubicación',
    ciudad: null,
    estado: null,
  },

  createOficinaEntities(count: number): Oficina[] {
    return Array.from({ length: count }, (_, i) =>
      Oficina.create({
        codigo: `OF-${i.toString().padStart(3, '0')}`,
        nombre: `Oficina de prueba ${i}`,
      }),
    );
  },
};
