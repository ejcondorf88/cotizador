import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData20250420000006 implements MigrationInterface {
  name = 'SeedInitialData20250420000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Seed Giros (reemplaza mock de activities)
    await queryRunner.query(`
      INSERT INTO catalog.giros (clave, descripcion, sector, riesgo, activo) VALUES
      ('461110', 'Comercio al por mayor de abarrotes', 'Comercio', 'MEDIO', true),
      ('461121', 'Comercio al por mayor de bebidas', 'Comercio', 'MEDIO', true),
      ('461122', 'Comercio al por mayor de cigarros', 'Comercio', 'BAJO', true),
      ('461130', 'Comercio al por mayor de productos textiles', 'Comercio', 'MEDIO', true),
      ('461140', 'Comercio al por mayor de calzado', 'Comercio', 'BAJO', true),
      ('461150', 'Comercio al por mayor de artículos de joyería', 'Comercio', 'ALTO', true),
      ('462111', 'Comercio al por menor en tiendas de abarrotes', 'Comercio', 'BAJO', true),
      ('462112', 'Comercio al por menor en tiendas de departamentos', 'Comercio', 'MEDIO', true),
      ('462113', 'Comercio al por menor en supermercados', 'Comercio', 'MEDIO', true),
      ('464111', 'Comercio al por menor de medicamentos', 'Salud', 'BAJO', true),
      ('464112', 'Comercio al por menor de artículos ortopédicos', 'Salud', 'BAJO', true),
      ('465211', 'Comercio al por menor de artículos de ferretería', 'Comercio', 'ALTO', true),
      ('465311', 'Comercio al por menor de pintura y barniz', 'Comercio', 'ALTO', true),
      ('511110', 'Edición de libros', 'Servicios', 'BAJO', true),
      ('512110', 'Producción de películas', 'Servicios', 'MEDIO', true),
      ('513210', 'Programación de software', 'Tecnología', 'BAJO', true),
      ('541110', 'Servicios legales', 'Servicios Profesionales', 'BAJO', true),
      ('541211', 'Servicios de contabilidad', 'Servicios Profesionales', 'BAJO', true),
      ('541330', 'Servicios de arquitectura', 'Servicios Profesionales', 'BAJO', true),
      ('541511', 'Servicios de diseño de sistemas de cómputo', 'Tecnología', 'BAJO', true),
      ('551110', 'Servicios de hospedaje', 'Turismo', 'MEDIO', true),
      ('561110', 'Servicios de administración de negocios', 'Servicios', 'BAJO', true),
      ('621110', 'Servicios médicos de consulta externa', 'Salud', 'BAJO', true),
      ('711110', 'Actividades teatrales', 'Entretenimiento', 'MEDIO', true),
      ('811110', 'Reparación y mantenimiento de automóviles', 'Servicios', 'ALTO', true),
      ('931110', 'Actividades legislativas', 'Gobierno', 'BAJO', true);
    `);

    // Seed Oficinas
    await queryRunner.query(`
      INSERT INTO catalog.oficinas (codigo, nombre, ciudad, estado, activo) VALUES
      ('OF001', 'Oficina Centro', 'Ciudad de México', 'CDMX', true),
      ('OF002', 'Oficina Monterrey', 'Monterrey', 'Nuevo León', true),
      ('OF003', 'Oficina Guadalajara', 'Guadalajara', 'Jalisco', true),
      ('OF004', 'Oficina Puebla', 'Puebla', 'Puebla', true),
      ('OF005', 'Oficina Querétaro', 'Querétaro', 'Querétaro', true),
      ('OF006', 'Oficina Mérida', 'Mérida', 'Yucatán', true),
      ('OF007', 'Oficina Cancún', 'Cancún', 'Quintana Roo', true),
      ('OF008', 'Oficina Tijuana', 'Tijuana', 'Baja California', true);
    `);

    // Seed Suscriptores
    await queryRunner.query(`
      INSERT INTO catalog.suscriptores (codigo, nombre, tipo, activo) VALUES
      ('SUS001', 'Seguros del Norte S.A.', 'Aseguradora', true),
      ('SUS002', 'Aseguradora Metropolitana', 'Aseguradora', true),
      ('SUS003', 'Seguros Continental', 'Aseguradora', true),
      ('SUS004', 'Resguarda Seguros', 'Aseguradora', true),
      ('SUS005', 'Protección Total S.A.', 'Aseguradora', true);
    `);

    // Seed Agentes (necesitamos los IDs de las oficinas primero)
    await queryRunner.query(`
      INSERT INTO catalog.agentes (codigo, nombre, email, telefono, oficina_id, activo)
      SELECT 
        'AGT001', 'Juan Pérez García', 'juan.perez@segurax.com', '5512345678', id, true
      FROM catalog.oficinas WHERE codigo = 'OF001';
    `);

    await queryRunner.query(`
      INSERT INTO catalog.agentes (codigo, nombre, email, telefono, oficina_id, activo)
      SELECT 
        'AGT002', 'María López Martínez', 'maria.lopez@segurax.com', '5512345679', id, true
      FROM catalog.oficinas WHERE codigo = 'OF001';
    `);

    await queryRunner.query(`
      INSERT INTO catalog.agentes (codigo, nombre, email, telefono, oficina_id, activo)
      SELECT 
        'AGT003', 'Carlos Rodríguez Sánchez', 'carlos.rodriguez@segurax.com', '8181234567', id, true
      FROM catalog.oficinas WHERE codigo = 'OF002';
    `);

    await queryRunner.query(`
      INSERT INTO catalog.agentes (codigo, nombre, email, telefono, oficina_id, activo)
      SELECT 
        'AGT004', 'Ana Martínez Torres', 'ana.martinez@segurax.com', '3312345678', id, true
      FROM catalog.oficinas WHERE codigo = 'OF003';
    `);

    await queryRunner.query(`
      INSERT INTO catalog.agentes (codigo, nombre, email, telefono, oficina_id, activo)
      SELECT 
        'AGT005', 'Roberto Gómez Hernández', 'roberto.gomez@segurax.com', '2221234567', id, true
      FROM catalog.oficinas WHERE codigo = 'OF004';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM catalog.agentes WHERE codigo LIKE \'AGT%\'');
    await queryRunner.query('DELETE FROM catalog.suscriptores WHERE codigo LIKE \'SUS%\'');
    await queryRunner.query('DELETE FROM catalog.oficinas WHERE codigo LIKE \'OF%\'');
    await queryRunner.query('DELETE FROM catalog.giros WHERE clave LIKE \'46%\' OR clave LIKE \'51%\' OR clave LIKE \'54%\' OR clave LIKE \'55%\' OR clave LIKE \'56%\' OR clave LIKE \'62%\' OR clave LIKE \'71%\' OR clave LIKE \'81%\' OR clave LIKE \'93%\'');
  }
}
