import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCotizacionesTable20260418013401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cotizaciones',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'numero_folio',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'estado',
            type: 'varchar',
            length: '20',
            default: "'BORRADOR'",
            isNullable: false,
          },
          {
            name: 'fecha_creacion',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'fecha_actualizacion',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create index on numero_folio for faster lookups
    await queryRunner.createIndex(
      'cotizaciones',
      new TableIndex({
        name: 'IDX_COTIZACIONES_NUMERO_FOLIO',
        columnNames: ['numero_folio'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('cotizaciones', 'IDX_COTIZACIONES_NUMERO_FOLIO');
    await queryRunner.dropTable('cotizaciones');
  }
}
