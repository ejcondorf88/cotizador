import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class RenameCotizacionesToQuotes20260418140000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename columns from Spanish to English
    await queryRunner.renameColumn('cotizaciones', 'numero_folio', 'folio_number');
    await queryRunner.renameColumn('cotizaciones', 'estado', 'status');
    await queryRunner.renameColumn('cotizaciones', 'fecha_creacion', 'created_at');
    await queryRunner.renameColumn('cotizaciones', 'fecha_actualizacion', 'updated_at');

    // Update status values from Spanish to English
    await queryRunner.query(`
      UPDATE cotizaciones 
      SET status = CASE status
        WHEN 'BORRADOR' THEN 'DRAFT'
        WHEN 'EN_PROCESO' THEN 'IN_PROGRESS'
        WHEN 'COMPLETADA' THEN 'COMPLETED'
        WHEN 'CANCELADA' THEN 'CANCELLED'
        ELSE 'DRAFT'
      END
    `);

    // Drop old index
    await queryRunner.dropIndex('cotizaciones', 'IDX_COTIZACIONES_NUMERO_FOLIO');

    // Rename table
    await queryRunner.renameTable('cotizaciones', 'quotes');

    // Create new index with English name
    await queryRunner.createIndex(
      'quotes',
      new TableIndex({
        name: 'IDX_QUOTES_FOLIO_NUMBER',
        columnNames: ['folio_number'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new index
    await queryRunner.dropIndex('quotes', 'IDX_QUOTES_FOLIO_NUMBER');

    // Rename table back
    await queryRunner.renameTable('quotes', 'cotizaciones');

    // Create old index
    await queryRunner.createIndex(
      'cotizaciones',
      new TableIndex({
        name: 'IDX_COTIZACIONES_NUMERO_FOLIO',
        columnNames: ['numero_folio'],
        isUnique: true,
      }),
    );

    // Revert status values
    await queryRunner.query(`
      UPDATE cotizaciones 
      SET estado = CASE estado
        WHEN 'DRAFT' THEN 'BORRADOR'
        WHEN 'IN_PROGRESS' THEN 'EN_PROCESO'
        WHEN 'COMPLETED' THEN 'COMPLETADA'
        WHEN 'CANCELLED' THEN 'CANCELADA'
        ELSE 'BORRADOR'
      END
    `);

    // Rename columns back to Spanish
    await queryRunner.renameColumn('cotizaciones', 'folio_number', 'numero_folio');
    await queryRunner.renameColumn('cotizaciones', 'status', 'estado');
    await queryRunner.renameColumn('cotizaciones', 'created_at', 'fecha_creacion');
    await queryRunner.renameColumn('cotizaciones', 'updated_at', 'fecha_actualizacion');
  }
}
