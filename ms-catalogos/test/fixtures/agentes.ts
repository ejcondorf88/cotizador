import { Agente } from '../../src/domain/agentes/entities/agente.entity';

export const agentesFixtures = {
  validAgente: {
    codigo: 'AGT-001',
    nombre: 'Agente Test',
    email: 'agente@test.com',
    telefono: '555-1234',
    oficinaId: 'oficina-uuid-001',
  },

  validAgenteMin: {
    codigo: 'AGT-MIN',
    nombre: 'Agente Mínimo',
  },

  agenteSinOficina: {
    codigo: 'AGT-NO-OFI',
    nombre: 'Agente Sin Oficina',
    email: null,
    telefono: null,
    oficinaId: null,
  },

  createAgenteEntities(count: number): Agente[] {
    return Array.from({ length: count }, (_, i) =>
      Agente.create({
        codigo: `AGT-${i.toString().padStart(3, '0')}`,
        nombre: `Agente de prueba ${i}`,
      }),
    );
  },
};
