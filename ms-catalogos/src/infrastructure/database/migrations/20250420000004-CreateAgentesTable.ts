import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAgentesTable20250420000004 implements MigrationInterface {
  name = 'CreateAgentesTable20250420000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agentes',
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
            name: 'email',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'telefono',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'oficina_id',
            type: 'uuid',
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
      'catalog.agentes',
      new TableIndex({
        name: 'idx_agentes_codigo',
        columnNames: ['codigo'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'catalog.agentes',
      new TableIndex({
        name: 'idx_agentes_activo',
        columnNames: ['activo'],
      }),
    );

    await queryRunner.createIndex(
      'catalog.agentes',
      new TableIndex({
        name: 'idx_agentes_nombre',
        columnNames: ['nombre'],
      }),
    );

    await queryRunner.createIndex(
      'catalog.agentes',
      new TableIndex({
        name: 'idx_agentes_oficina',
        columnNames: ['oficina_id'],
      }),
    );

    // Crear foreign key
    await queryRunner.createForeignKey(
      'catalog.agentes',
      new TableForeignKey({
        name: 'fk_agentes_oficina',
        columnNames: ['oficina_id'],
        referencedTableName: 'catalog.oficinas',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('catalog.agentes', true);
  }
}
