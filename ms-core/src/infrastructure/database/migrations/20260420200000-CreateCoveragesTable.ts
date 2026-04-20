import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateCoveragesTable20260420200000 implements MigrationInterface {
  name = 'CreateCoveragesTable20260420200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types first
    await queryRunner.query(`
      CREATE TYPE coverage_code_enum AS ENUM (
        'FIRE', 'CAT', 'GLASS', 'WATER', 'THEFT', 
        'LIABILITY', 'ELECTRONIC', 'EXTRA_EXPENSES'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE coverage_type_enum AS ENUM ('MANDATORY', 'OPTIONAL')
    `);

    // Create coverages table
    await queryRunner.createTable(
      new Table({
        name: 'coverages',
        columns: [
          {
            name: 'id',
            type: 'enum',
            enumName: 'coverage_code_enum',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enumName: 'coverage_type_enum',
            isNullable: false,
          },
          {
            name: 'base_rate',
            type: 'decimal',
            precision: 10,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'icon',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create quote_coverages junction table
    await queryRunner.createTable(
      new Table({
        name: 'quote_coverages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'quote_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'coverage_id',
            type: 'enum',
            enumName: 'coverage_code_enum',
            isNullable: false,
          },
          {
            name: 'is_selected',
            type: 'boolean',
            default: true,
          },
          {
            name: 'selected_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add indexes for performance
    await queryRunner.createIndex(
      'coverages',
      new TableIndex({
        name: 'IDX_COVERAGES_TYPE',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'coverages',
      new TableIndex({
        name: 'IDX_COVERAGES_IS_ACTIVE',
        columnNames: ['is_active'],
      }),
    );

    await queryRunner.createIndex(
      'quote_coverages',
      new TableIndex({
        name: 'IDX_QUOTE_COVERAGES_QUOTE_ID',
        columnNames: ['quote_id'],
      }),
    );

    await queryRunner.createIndex(
      'quote_coverages',
      new TableIndex({
        name: 'IDX_QUOTE_COVERAGES_COVERAGE_ID',
        columnNames: ['coverage_id'],
      }),
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'quote_coverages',
      new TableForeignKey({
        name: 'FK_QUOTE_COVERAGES_QUOTE',
        columnNames: ['quote_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'quotes',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'quote_coverages',
      new TableForeignKey({
        name: 'FK_QUOTE_COVERAGES_COVERAGE',
        columnNames: ['coverage_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'coverages',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.dropForeignKey('quote_coverages', 'FK_QUOTE_COVERAGES_COVERAGE');
    await queryRunner.dropForeignKey('quote_coverages', 'FK_QUOTE_COVERAGES_QUOTE');

    // Drop indexes
    await queryRunner.dropIndex('quote_coverages', 'IDX_QUOTE_COVERAGES_COVERAGE_ID');
    await queryRunner.dropIndex('quote_coverages', 'IDX_QUOTE_COVERAGES_QUOTE_ID');
    await queryRunner.dropIndex('coverages', 'IDX_COVERAGES_IS_ACTIVE');
    await queryRunner.dropIndex('coverages', 'IDX_COVERAGES_TYPE');

    // Drop tables
    await queryRunner.dropTable('quote_coverages');
    await queryRunner.dropTable('coverages');

    // Drop enum types
    await queryRunner.query('DROP TYPE IF EXISTS coverage_type_enum');
    await queryRunner.query('DROP TYPE IF EXISTS coverage_code_enum');
  }
}
