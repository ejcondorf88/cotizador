import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddQuoteDetails20260418200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Asegurado
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'company_name',
      type: 'varchar',
      length: '150',
      isNullable: true,
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'rfc',
      type: 'varchar',
      length: '13',
      isNullable: true,
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'business_line',
      type: 'varchar',
      length: '50',
      isNullable: true,
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'business_type',
      type: 'varchar',
      length: '50',
      isNullable: true,
    }));

    // Conducción
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'agent_key',
      type: 'varchar',
      length: '20',
      isNullable: true,
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'agent_name',
      type: 'varchar',
      length: '100',
      isNullable: true,
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'subscriber',
      type: 'varchar',
      length: '100',
      isNullable: true,
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'office',
      type: 'varchar',
      length: '100',
      isNullable: true,
    }));

    // Vigencia
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'validity_start',
      type: 'timestamp',
      isNullable: true,
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'validity_end',
      type: 'timestamp',
      isNullable: true,
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'currency',
      type: 'varchar',
      length: '3',
      isNullable: true,
      default: 'MXN',
    }));

    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'payment_type',
      type: 'varchar',
      length: '20',
      isNullable: true,
    }));

    // Índice para búsqueda por status
    await queryRunner.createIndex(
      'quotes',
      new TableIndex({
        name: 'IDX_QUOTES_STATUS',
        columnNames: ['status'],
      }),
    );

    // Índice para búsqueda por fecha de creación (para ordenamiento)
    await queryRunner.createIndex(
      'quotes',
      new TableIndex({
        name: 'IDX_QUOTES_CREATED_AT',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('quotes', 'IDX_QUOTES_CREATED_AT');
    await queryRunner.dropIndex('quotes', 'IDX_QUOTES_STATUS');

    // Drop columns in reverse order
    await queryRunner.dropColumn('quotes', 'payment_type');
    await queryRunner.dropColumn('quotes', 'currency');
    await queryRunner.dropColumn('quotes', 'validity_end');
    await queryRunner.dropColumn('quotes', 'validity_start');
    await queryRunner.dropColumn('quotes', 'office');
    await queryRunner.dropColumn('quotes', 'subscriber');
    await queryRunner.dropColumn('quotes', 'agent_name');
    await queryRunner.dropColumn('quotes', 'agent_key');
    await queryRunner.dropColumn('quotes', 'business_type');
    await queryRunner.dropColumn('quotes', 'business_line');
    await queryRunner.dropColumn('quotes', 'rfc');
    await queryRunner.dropColumn('quotes', 'company_name');
  }
}
