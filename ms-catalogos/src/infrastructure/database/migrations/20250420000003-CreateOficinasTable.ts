import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateOficinasTable20250420000003 implements MigrationInterface {
  name = 'CreateOficinasTable20250420000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'oficinas',
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
            length: '100',
            isNullable: false,
          },
          {
            name: 'ciudad',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'estado',
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
      'catalog.oficinas',
      new TableIndex({
        name: 'idx_oficinas_codigo',
        columnNames: ['codigo'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'catalog.oficinas',
      new TableIndex({
        name: 'idx_oficinas_activo',
        columnNames: ['activo'],
      }),
    );

    await queryRunner.createIndex(
      'catalog.oficinas',
      new TableIndex({
        name: 'idx_oficinas_estado',
        columnNames: ['estado'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('catalog.oficinas', true);
  }
}
