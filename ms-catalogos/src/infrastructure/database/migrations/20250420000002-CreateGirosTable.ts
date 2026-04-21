import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateGirosTable20250420000002 implements MigrationInterface {
  name = 'CreateGirosTable20250420000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'giros',
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
            name: 'clave',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'descripcion',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'sector',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'riesgo',
            type: 'varchar',
            length: '20',
            isNullable: false,
            default: "'MEDIO'",
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
      'catalog.giros',
      new TableIndex({
        name: 'idx_giros_clave',
        columnNames: ['clave'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'catalog.giros',
      new TableIndex({
        name: 'idx_giros_activo',
        columnNames: ['activo'],
      }),
    );

    await queryRunner.createIndex(
      'catalog.giros',
      new TableIndex({
        name: 'idx_giros_descripcion',
        columnNames: ['descripcion'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('catalog.giros', true);
  }
}
