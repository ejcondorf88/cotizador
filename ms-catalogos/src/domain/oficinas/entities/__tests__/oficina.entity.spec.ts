import { Oficina } from '../oficina.entity';

describe('Domain/Oficinas - Oficina Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create an oficina with generated UUID', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });

      expect(oficina.id).toBeDefined();
      expect(oficina.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(oficina.codigo).toBe('OF-001');
      expect(oficina.nombre).toBe('Oficina Principal');
    });

    it('should set ciudad and estado to null by default', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });

      expect(oficina.ciudad).toBeNull();
      expect(oficina.estado).toBeNull();
    });

    it('should create oficina with ubicacion', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
      });

      expect(oficina.ciudad).toBe('Ciudad de México');
      expect(oficina.estado).toBe('CDMX');
    });

    it('should set activo=true by default', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });

      expect(oficina.activo).toBe(true);
    });

    it('should set createdAt and updatedAt', () => {
      const before = new Date();
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });
      const after = new Date();

      expect(oficina.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(oficina.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(oficina.updatedAt).toEqual(oficina.createdAt);
    });
  });

  describe('update()', () => {
    it('should update only provided fields', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Original',
        ciudad: 'Guadalajara',
        estado: 'Jalisco',
      });
      const originalUpdatedAt = oficina.updatedAt;

      jest.advanceTimersByTime(1);

      oficina.update({ nombre: 'Oficina Actualizada' });

      expect(oficina.nombre).toBe('Oficina Actualizada');
      expect(oficina.codigo).toBe('OF-001'); // No cambió
      expect(oficina.ciudad).toBe('Guadalajara'); // No cambió
      expect(oficina.estado).toBe('Jalisco'); // No cambió
      expect(oficina.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should update ubicacion', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });

      oficina.update({
        ciudad: 'Monterrey',
        estado: 'Nuevo León',
      });

      expect(oficina.ciudad).toBe('Monterrey');
      expect(oficina.estado).toBe('Nuevo León');
    });

    it('should update only ciudad', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
        ciudad: 'Guadalajara',
        estado: 'Jalisco',
      });

      oficina.update({ ciudad: 'Zapopan' });

      expect(oficina.ciudad).toBe('Zapopan');
      expect(oficina.estado).toBe('Jalisco'); // No cambió
    });

    it('should not change ciudad when provided as undefined', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
        ciudad: 'Ciudad de México',
      });

      oficina.update({ ciudad: undefined });

      // Undefined means "don't update", so ciudad should remain
      expect(oficina.ciudad).toBe('Ciudad de México');
    });

    it('should update codigo', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });

      oficina.update({ codigo: 'OF-002' });

      expect(oficina.codigo).toBe('OF-002');
    });

    it('should update all fields at once', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });

      oficina.update({
        codigo: 'OF-NEW',
        nombre: 'Nueva Oficina',
        ciudad: 'Puebla',
        estado: 'Puebla',
      });

      expect(oficina.codigo).toBe('OF-NEW');
      expect(oficina.nombre).toBe('Nueva Oficina');
      expect(oficina.ciudad).toBe('Puebla');
      expect(oficina.estado).toBe('Puebla');
    });
  });

  describe('deactivate()', () => {
    it('should set activo=false', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });

      oficina.deactivate();

      expect(oficina.activo).toBe(false);
    });

    it('should update updatedAt', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });
      const originalUpdatedAt = oficina.updatedAt;

      jest.advanceTimersByTime(1);
      oficina.deactivate();

      expect(oficina.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('activate()', () => {
    it('should set activo=true', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });
      oficina.deactivate();
      expect(oficina.activo).toBe(false);

      oficina.activate();

      expect(oficina.activo).toBe(true);
    });

    it('should update updatedAt on activate', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });
      oficina.deactivate();
      const deactivatedAt = oficina.updatedAt;

      jest.advanceTimersByTime(1);
      oficina.activate();

      expect(oficina.updatedAt.getTime()).toBeGreaterThan(deactivatedAt.getTime());
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
        ciudad: 'Ciudad',
      });

      oficina.update({ ciudad: '' });

      expect(oficina.ciudad).toBe('');
    });

    it('should preserve id after updates', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });
      const originalId = oficina.id;

      oficina.update({ nombre: 'Updated' });
      oficina.deactivate();

      expect(oficina.id).toBe(originalId);
    });

    it('should preserve createdAt immutability', () => {
      const oficina = Oficina.create({
        codigo: 'OF-001',
        nombre: 'Oficina Principal',
      });
      const originalCreatedAt = oficina.createdAt;

      oficina.update({ nombre: 'Updated' });
      oficina.deactivate();

      expect(oficina.createdAt).toEqual(originalCreatedAt);
    });
  });
});
