import { Suscriptor } from '../../src/domain/suscriptores/entities/suscriptor.entity';

export const suscriptoresFixtures = {
  validSuscriptor: {
    codigo: 'SUB-001',
    nombre: 'Suscriptor Test',
    tipo: 'STANDARD',
  },

  suscriptorSinTipo: {
    codigo: 'SUB-NO-TYPE',
    nombre: 'Suscriptor Sin Tipo',
    tipo: null,
  },

  createSuscriptorEntities(count: number): Suscriptor[] {
    return Array.from({ length: count }, (_, i) =>
      Suscriptor.create({
        codigo: `SUB-${i.toString().padStart(3, '0')}`,
        nombre: `Suscriptor de prueba ${i}`,
      }),
    );
  },
};
