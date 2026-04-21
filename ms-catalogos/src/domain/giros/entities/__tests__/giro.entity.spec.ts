import { Giro } from '../giro.entity';

describe('Domain/Giros - Giro Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a giro with generated UUID', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio al por mayor',
      });

      expect(giro.id).toBeDefined();
      expect(giro.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i); // UUID v4 format
      expect(giro.clave).toBe('COM-001');
      expect(giro.descripcion).toBe('Comercio al por mayor');
    });

    it('should assign default risk level MEDIO', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      expect(giro.riesgo).toBe('MEDIO');
    });

    it('should allow custom risk level', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        riesgo: 'ALTO',
      });

      expect(giro.riesgo).toBe('ALTO');
    });

    it('should allow BAJO risk level', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        riesgo: 'BAJO',
      });

      expect(giro.riesgo).toBe('BAJO');
    });

    it('should set activo=true by default', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      expect(giro.activo).toBe(true);
    });

    it('should set createdAt and updatedAt', () => {
      const before = new Date();
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      const after = new Date();

      expect(giro.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(giro.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(giro.updatedAt).toEqual(giro.createdAt);
    });

    it('should set sector to null when not provided', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      expect(giro.sector).toBeNull();
    });

    it('should set sector when provided', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        sector: 'Retail',
      });

      expect(giro.sector).toBe('Retail');
    });
  });

  describe('update()', () => {
    it('should update only provided fields', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio Original',
        sector: 'Retail',
        riesgo: 'MEDIO',
      });
      const originalUpdatedAt = giro.updatedAt;

      // Esperar un ms para asegurar diferencia de tiempo
      jest.advanceTimersByTime(1);

      giro.update({ descripcion: 'Comercio Actualizado' });

      expect(giro.descripcion).toBe('Comercio Actualizado');
      expect(giro.clave).toBe('COM-001'); // No cambió
      expect(giro.sector).toBe('Retail'); // No cambió
      expect(giro.riesgo).toBe('MEDIO'); // No cambió
      expect(giro.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should update multiple fields at once', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      giro.update({
        descripcion: 'Nueva descripción',
        riesgo: 'ALTO',
        sector: 'Nuevo sector',
      });

      expect(giro.descripcion).toBe('Nueva descripción');
      expect(giro.riesgo).toBe('ALTO');
      expect(giro.sector).toBe('Nuevo sector');
    });

    it('should update clave field', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      giro.update({ clave: 'COM-002' });

      expect(giro.clave).toBe('COM-002');
    });

    it('should not change sector when explicitly provided as undefined', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        sector: 'Retail',
      });

      giro.update({ sector: undefined });

      // Undefined means "don't update", so sector should remain 'Retail'
      expect(giro.sector).toBe('Retail');
    });

    it('should not update fields when empty object provided', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
        sector: 'Retail',
      });
      const originalDescripcion = giro.descripcion;

      giro.update({});

      expect(giro.descripcion).toBe(originalDescripcion);
      expect(giro.sector).toBe('Retail');
    });
  });

  describe('deactivate()', () => {
    it('should set activo=false', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      giro.deactivate();

      expect(giro.activo).toBe(false);
    });

    it('should update updatedAt', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      const originalUpdatedAt = giro.updatedAt;

      jest.advanceTimersByTime(1);
      giro.deactivate();

      expect(giro.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('activate()', () => {
    it('should set activo=true', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      giro.deactivate();
      expect(giro.activo).toBe(false);

      giro.activate();

      expect(giro.activo).toBe(true);
    });

    it('should update updatedAt on activate', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      giro.deactivate();
      const deactivatedAt = giro.updatedAt;

      jest.advanceTimersByTime(1);
      giro.activate();

      expect(giro.updatedAt.getTime()).toBeGreaterThan(deactivatedAt.getTime());
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings in update', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      giro.update({ descripcion: '' });

      expect(giro.descripcion).toBe('');
    });

    it('should preserve id after updates', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      const originalId = giro.id;

      // Perform various updates
      giro.update({ descripcion: 'Updated' });
      giro.deactivate();
      giro.activate();

      // Id should remain unchanged
      expect(giro.id).toBe(originalId);
    });

    it('should preserve createdAt immutability', () => {
      const giro = Giro.create({
        clave: 'COM-001',
        descripcion: 'Comercio',
      });
      const originalCreatedAt = giro.createdAt;

      giro.update({ descripcion: 'Updated' });
      giro.deactivate();
      giro.activate();

      expect(giro.createdAt).toEqual(originalCreatedAt);
    });
  });
});
