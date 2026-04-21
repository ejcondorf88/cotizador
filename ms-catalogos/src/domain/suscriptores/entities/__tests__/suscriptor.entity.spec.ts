import { Suscriptor } from '../suscriptor.entity';

describe('Domain/Suscriptores - Suscriptor Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a suscriptor with generated UUID', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });

      expect(suscriptor.id).toBeDefined();
      expect(suscriptor.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(suscriptor.codigo).toBe('SUB-001');
      expect(suscriptor.nombre).toBe('Suscriptor Test');
    });

    it('should set tipo to null by default', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });

      expect(suscriptor.tipo).toBeNull();
    });

    it('should create suscriptor with tipo', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
        tipo: 'PREMIUM',
      });

      expect(suscriptor.tipo).toBe('PREMIUM');
    });

    it('should set activo=true by default', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });

      expect(suscriptor.activo).toBe(true);
    });

    it('should set createdAt and updatedAt', () => {
      const before = new Date();
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });
      const after = new Date();

      expect(suscriptor.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(suscriptor.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(suscriptor.updatedAt).toEqual(suscriptor.createdAt);
    });
  });

  describe('update()', () => {
    it('should update only provided fields', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Original',
        tipo: 'STANDARD',
      });
      const originalUpdatedAt = suscriptor.updatedAt;

      jest.advanceTimersByTime(1);

      suscriptor.update({ nombre: 'Suscriptor Actualizado' });

      expect(suscriptor.nombre).toBe('Suscriptor Actualizado');
      expect(suscriptor.codigo).toBe('SUB-001'); // No cambió
      expect(suscriptor.tipo).toBe('STANDARD'); // No cambió
      expect(suscriptor.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should update tipo', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });

      suscriptor.update({ tipo: 'PREMIUM' });

      expect(suscriptor.tipo).toBe('PREMIUM');
    });

    it('should not change tipo when provided as undefined', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
        tipo: 'PREMIUM',
      });

      suscriptor.update({ tipo: undefined });

      // Undefined means "don't update", so tipo should remain 'PREMIUM'
      expect(suscriptor.tipo).toBe('PREMIUM');
    });

    it('should update codigo', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });

      suscriptor.update({ codigo: 'SUB-002' });

      expect(suscriptor.codigo).toBe('SUB-002');
    });

    it('should update all fields at once', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });

      suscriptor.update({
        codigo: 'SUB-NEW',
        nombre: 'Nuevo Nombre',
        tipo: 'GOLD',
      });

      expect(suscriptor.codigo).toBe('SUB-NEW');
      expect(suscriptor.nombre).toBe('Nuevo Nombre');
      expect(suscriptor.tipo).toBe('GOLD');
    });
  });

  describe('deactivate()', () => {
    it('should set activo=false', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });

      suscriptor.deactivate();

      expect(suscriptor.activo).toBe(false);
    });

    it('should update updatedAt', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });
      const originalUpdatedAt = suscriptor.updatedAt;

      jest.advanceTimersByTime(1);
      suscriptor.deactivate();

      expect(suscriptor.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('activate()', () => {
    it('should set activo=true', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });
      suscriptor.deactivate();
      expect(suscriptor.activo).toBe(false);

      suscriptor.activate();

      expect(suscriptor.activo).toBe(true);
    });

    it('should update updatedAt on activate', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });
      suscriptor.deactivate();
      const deactivatedAt = suscriptor.updatedAt;

      jest.advanceTimersByTime(1);
      suscriptor.activate();

      expect(suscriptor.updatedAt.getTime()).toBeGreaterThan(deactivatedAt.getTime());
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
        tipo: 'PREMIUM',
      });

      suscriptor.update({ tipo: '' });

      expect(suscriptor.tipo).toBe('');
    });

    it('should preserve id after updates', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });
      const originalId = suscriptor.id;

      suscriptor.update({ nombre: 'Updated' });
      suscriptor.deactivate();

      expect(suscriptor.id).toBe(originalId);
    });

    it('should preserve createdAt immutability', () => {
      const suscriptor = Suscriptor.create({
        codigo: 'SUB-001',
        nombre: 'Suscriptor Test',
      });
      const originalCreatedAt = suscriptor.createdAt;

      suscriptor.update({ nombre: 'Updated' });
      suscriptor.deactivate();

      expect(suscriptor.createdAt).toEqual(originalCreatedAt);
    });
  });
});
