import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePropertiesTable20260418220000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'properties',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'quote_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'street',
            type: 'varchar',
            length: '200',
            isNullable: false,
            default: "''",
          },
          {
            name: 'neighborhood',
            type: 'varchar',
            length: '100',
            isNullable: false,
            default: "''",
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
            isNullable: false,
            default: "''",
          },
          {
            name: 'state',
            type: 'varchar',
            length: '50',
            isNullable: false,
            default: "''",
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '5',
            isNullable: false,
            default: "''",
          },
          {
            name: 'insured_value',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
            default: 0,
          },
          {
            name: 'construction_type',
            type: 'enum',
            enum: ['CONCRETO', 'ACERO', 'MAMPOSTERIA', 'MADERA', 'OTRO'],
            isNullable: true,
          },
          {
            name: 'usage',
            type: 'enum',
            enum: ['COMERCIAL', 'INDUSTRIAL', 'OFICINA', 'RESIDENCIAL', 'MIXTO'],
            isNullable: true,
          },
          {
            name: 'completion_percentage',
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Add index on quote_id for performance
    await queryRunner.createIndex(
      'properties',
      new TableIndex({
        name: 'idx_properties_quote_id',
        columnNames: ['quote_id'],
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'properties',
      new TableForeignKey({
        name: 'fk_properties_quote',
        columnNames: ['quote_id'],
        referencedTableName: 'quotes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('properties', 'fk_properties_quote');
    await queryRunner.dropIndex('properties', 'idx_properties_quote_id');
    await queryRunner.dropTable('properties');
  }
}
