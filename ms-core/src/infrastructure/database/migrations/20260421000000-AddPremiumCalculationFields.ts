import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddPremiumCalculationFields20260421000000 implements MigrationInterface {
  name = 'AddPremiumCalculationFields20260421000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // 1. Modificar tabla 'quotes'
    // ============================================
    await queryRunner.addColumn(
      'quotes',
      new TableColumn({
        name: 'net_premium',
        type: 'decimal',
        precision: 12,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'quotes',
      new TableColumn({
        name: 'commercial_premium',
        type: 'decimal',
        precision: 12,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'quotes',
      new TableColumn({
        name: 'commercial_factor',
        type: 'decimal',
        precision: 4,
        scale: 2,
        default: 1.2,
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'quotes',
      new TableColumn({
        name: 'calculated_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'quotes',
      new TableColumn({
        name: 'version',
        type: 'integer',
        default: 1,
        isNullable: false,
      }),
    );

    // ============================================
    // 2. Modificar tabla 'properties'
    // ============================================
    await queryRunner.addColumn(
      'properties',
      new TableColumn({
        name: 'net_premium',
        type: 'decimal',
        precision: 12,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'properties',
      new TableColumn({
        name: 'commercial_premium',
        type: 'decimal',
        precision: 12,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'properties',
      new TableColumn({
        name: 'incomplete_reason',
        type: 'text',
        isNullable: true,
      }),
    );

    // ============================================
    // 3. Modificar tabla 'quote_coverages'
    // ============================================
    await queryRunner.addColumn(
      'quote_coverages',
      new TableColumn({
        name: 'calculated_premium',
        type: 'decimal',
        precision: 12,
        scale: 2,
        isNullable: true,
      }),
    );

    // ============================================
    // 4. Crear nueva tabla 'premium_breakdowns'
    // ============================================
    await queryRunner.createTable(
      new Table({
        name: 'premium_breakdowns',
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
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'property_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'coverage_code',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'coverage_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        uniques: [
          {
            name: 'UQ_PREMIUM_BREAKDOWN_QUOTE_PROPERTY_COVERAGE',
            columnNames: ['quote_id', 'property_id', 'coverage_code'],
          },
        ],
      }),
      true,
    );

    // ============================================
    // 5. Crear índices para 'premium_breakdowns'
    // ============================================
    await queryRunner.createIndex(
      'premium_breakdowns',
      new TableIndex({
        name: 'IDX_PREMIUM_BREAKDOWN_QUOTE_ID',
        columnNames: ['quote_id'],
      }),
    );

    await queryRunner.createIndex(
      'premium_breakdowns',
      new TableIndex({
        name: 'IDX_PREMIUM_BREAKDOWN_PROPERTY_ID',
        columnNames: ['property_id'],
      }),
    );

    await queryRunner.createIndex(
      'premium_breakdowns',
      new TableIndex({
        name: 'IDX_PREMIUM_BREAKDOWN_COVERAGE_CODE',
        columnNames: ['coverage_code'],
      }),
    );

    // ============================================
    // 6. Crear índices adicionales para búsquedas frecuentes
    // ============================================
    await queryRunner.createIndex(
      'quotes',
      new TableIndex({
        name: 'IDX_QUOTES_NET_PREMIUM',
        columnNames: ['net_premium'],
      }),
    );

    await queryRunner.createIndex(
      'properties',
      new TableIndex({
        name: 'IDX_PROPERTIES_NET_PREMIUM',
        columnNames: ['net_premium'],
      }),
    );

    // ============================================
    // 7. Agregar Foreign Keys para 'premium_breakdowns'
    // ============================================
    await queryRunner.createForeignKey(
      'premium_breakdowns',
      new TableForeignKey({
        name: 'FK_PREMIUM_BREAKDOWN_QUOTE',
        columnNames: ['quote_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'quotes',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'premium_breakdowns',
      new TableForeignKey({
        name: 'FK_PREMIUM_BREAKDOWN_PROPERTY',
        columnNames: ['property_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'properties',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ============================================
    // Revertir en orden inverso
    // ============================================

    // 1. Eliminar Foreign Keys de premium_breakdowns
    await queryRunner.dropForeignKey('premium_breakdowns', 'FK_PREMIUM_BREAKDOWN_PROPERTY');
    await queryRunner.dropForeignKey('premium_breakdowns', 'FK_PREMIUM_BREAKDOWN_QUOTE');

    // 2. Eliminar índices adicionales
    await queryRunner.dropIndex('properties', 'IDX_PROPERTIES_NET_PREMIUM');
    await queryRunner.dropIndex('quotes', 'IDX_QUOTES_NET_PREMIUM');

    // 3. Eliminar índices de premium_breakdowns
    await queryRunner.dropIndex('premium_breakdowns', 'IDX_PREMIUM_BREAKDOWN_COVERAGE_CODE');
    await queryRunner.dropIndex('premium_breakdowns', 'IDX_PREMIUM_BREAKDOWN_PROPERTY_ID');
    await queryRunner.dropIndex('premium_breakdowns', 'IDX_PREMIUM_BREAKDOWN_QUOTE_ID');

    // 4. Eliminar tabla premium_breakdowns
    await queryRunner.dropTable('premium_breakdowns');

    // 5. Eliminar columna de quote_coverages
    await queryRunner.dropColumn('quote_coverages', 'calculated_premium');

    // 6. Eliminar columnas de properties
    await queryRunner.dropColumn('properties', 'incomplete_reason');
    await queryRunner.dropColumn('properties', 'commercial_premium');
    await queryRunner.dropColumn('properties', 'net_premium');

    // 7. Eliminar columnas de quotes
    await queryRunner.dropColumn('quotes', 'version');
    await queryRunner.dropColumn('quotes', 'calculated_at');
    await queryRunner.dropColumn('quotes', 'commercial_factor');
    await queryRunner.dropColumn('quotes', 'commercial_premium');
    await queryRunner.dropColumn('quotes', 'net_premium');
  }
}
