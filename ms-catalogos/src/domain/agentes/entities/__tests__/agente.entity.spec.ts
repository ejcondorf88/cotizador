import { Agente } from '../agente.entity';

describe('Domain/Agentes - Agente Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create an agente with generated UUID', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      expect(agente.id).toBeDefined();
      expect(agente.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(agente.codigo).toBe('AGT-001');
      expect(agente.nombre).toBe('Agente Test');
    });

    it('should set optional fields to null by default', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      expect(agente.oficinaId).toBeNull();
      expect(agente.email).toBeNull();
      expect(agente.telefono).toBeNull();
    });

    it('should create agente with all optional fields', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        email: 'agente@test.com',
        telefono: '555-1234',
        oficinaId: 'oficina-uuid-001',
      });

      expect(agente.email).toBe('agente@test.com');
      expect(agente.telefono).toBe('555-1234');
      expect(agente.oficinaId).toBe('oficina-uuid-001');
    });

    it('should set activo=true by default', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      expect(agente.activo).toBe(true);
    });

    it('should allow explicit activo=false', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        activo: false,
      });

      expect(agente.activo).toBe(false);
    });

    it('should set createdAt and updatedAt', () => {
      const before = new Date();
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });
      const after = new Date();

      expect(agente.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(agente.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(agente.updatedAt).toEqual(agente.createdAt);
    });
  });

  describe('update()', () => {
    it('should update only provided fields', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Original',
        email: 'original@test.com',
        telefono: '555-0000',
      });
      const originalUpdatedAt = agente.updatedAt;

      jest.advanceTimersByTime(1);

      agente.update({ nombre: 'Agente Actualizado' });

      expect(agente.nombre).toBe('Agente Actualizado');
      expect(agente.codigo).toBe('AGT-001'); // No cambió
      expect(agente.email).toBe('original@test.com'); // No cambió
      expect(agente.telefono).toBe('555-0000'); // No cambió
      expect(agente.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should change oficina assignment', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        oficinaId: 'oficina-001',
      });

      agente.update({ oficinaId: 'oficina-002' });

      expect(agente.oficinaId).toBe('oficina-002');
    });

    it('should not change oficina when provided as undefined', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
        oficinaId: 'oficina-001',
      });

      agente.update({ oficinaId: undefined });

      // Undefined means "don't update", so oficinaId should remain
      expect(agente.oficinaId).toBe('oficina-001');
    });

    it('should update email', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      agente.update({ email: 'nuevo@test.com' });

      expect(agente.email).toBe('nuevo@test.com');
    });

    it('should update multiple fields at once', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      agente.update({
        nombre: 'Nuevo Nombre',
        email: 'nuevo@test.com',
        telefono: '555-9999',
        oficinaId: 'nueva-oficina',
      });

      expect(agente.nombre).toBe('Nuevo Nombre');
      expect(agente.email).toBe('nuevo@test.com');
      expect(agente.telefono).toBe('555-9999');
      expect(agente.oficinaId).toBe('nueva-oficina');
    });
  });

  describe('deactivate()', () => {
    it('should set activo=false', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      agente.deactivate();

      expect(agente.activo).toBe(false);
    });

    it('should update updatedAt', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });
      const originalUpdatedAt = agente.updatedAt;

      jest.advanceTimersByTime(1);
      agente.deactivate();

      expect(agente.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('activate()', () => {
    it('should set activo=true', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });
      agente.deactivate();
      expect(agente.activo).toBe(false);

      agente.activate();

      expect(agente.activo).toBe(true);
    });

    it('should update updatedAt on activate', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });
      agente.deactivate();
      const deactivatedAt = agente.updatedAt;

      jest.advanceTimersByTime(1);
      agente.activate();

      expect(agente.updatedAt.getTime()).toBeGreaterThan(deactivatedAt.getTime());
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });

      agente.update({ telefono: '' });

      expect(agente.telefono).toBe('');
    });

    it('should preserve id after updates', () => {
      const agente = Agente.create({
        codigo: 'AGT-001',
        nombre: 'Agente Test',
      });
      const originalId = agente.id;

      agente.update({ nombre: 'Updated' });
      agente.deactivate();

      expect(agente.id).toBe(originalId);
    });
  });
});
