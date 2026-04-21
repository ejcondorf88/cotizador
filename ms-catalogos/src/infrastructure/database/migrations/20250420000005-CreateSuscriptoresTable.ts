import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSuscriptoresTable20250420000005 implements MigrationInterface {
  name = 'CreateSuscriptoresTable20250420000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'suscriptores',
        schema: 'catalog',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'codigo',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'nombre',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'tipo',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'activo',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Crear índices
    await queryRunner.createIndex(
      'catalog.suscriptores',
      new TableIndex({
        name: 'idx_suscriptores_codigo',
        columnNames: ['codigo'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'catalog.suscriptores',
      new TableIndex({
        name: 'idx_suscriptores_activo',
        columnNames: ['activo'],
      }),
    );

    await queryRunner.createIndex(
      'catalog.suscriptores',
      new TableIndex({
        name: 'idx_suscriptores_nombre',
        columnNames: ['nombre'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('catalog.suscriptores', true);
  }
}
