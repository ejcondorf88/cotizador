import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateGiroDto } from '../create-giro.dto';

describe('Application/Giros/DTO - CreateGiroDto', () => {
  describe('validation', () => {
    it('should pass with valid data', async () => {
      // Arrange
      const dto = plainToInstance(CreateGiroDto, {
        clave: 'COM-001',
        descripcion: 'Comercio al por mayor',
        sector: 'Mayorista',
        riesgo: 'MEDIO',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail when clave is empty', async () => {
      // Arrange
      const dto = plainToInstance(CreateGiroDto, {
        clave: '',
        descripcion: 'Comercio',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'clave')).toBe(true);
    });

    it('should fail when descripcion is empty', async () => {
      // Arrange
      const dto = plainToInstance(CreateGiroDto, {
        clave: 'COM-001',
        descripcion: '',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.some((e) => e.property === 'descripcion')).toBe(true);
    });

    it('should fail when clave exceeds max length', async () => {
      // Arrange
      const dto = plainToInstance(CreateGiroDto, {
        clave: 'A'.repeat(21),
        descripcion: 'Comercio',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.some((e) => e.property === 'clave')).toBe(true);
    });

    it('should fail with invalid riesgo value', async () => {
      // Arrange
      const dto = plainToInstance(CreateGiroDto, {
        clave: 'COM-001',
        descripcion: 'Comercio',
        riesgo: 'INVALIDO',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.some((e) => e.property === 'riesgo')).toBe(true);
    });

    it('should pass with valid riesgo values', async () => {
      const validRiesgos = ['BAJO', 'MEDIO', 'ALTO', 'MUY_ALTO'];

      for (const riesgo of validRiesgos) {
        // Arrange
        const dto = plainToInstance(CreateGiroDto, {
          clave: 'COM-001',
          descripcion: 'Comercio',
          riesgo,
        });

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass with minimum required fields', async () => {
      // Arrange
      const dto = plainToInstance(CreateGiroDto, {
        clave: 'COM-001',
        descripcion: 'Comercio',
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass with optional fields as null', async () => {
      // Arrange
      const dto = plainToInstance(CreateGiroDto, {
        clave: 'COM-001',
        descripcion: 'Comercio',
        sector: null,
        riesgo: null,
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail when descripcion exceeds max length', async () => {
      // Arrange
      const dto = plainToInstance(CreateGiroDto, {
        clave: 'COM-001',
        descripcion: 'A'.repeat(501),
      });

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.some((e) => e.property === 'descripcion')).toBe(true);
    });
  });
});
