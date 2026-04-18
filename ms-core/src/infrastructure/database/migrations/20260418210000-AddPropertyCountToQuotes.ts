import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPropertyCountToQuotes20260418210000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('quotes', new TableColumn({
      name: 'property_count',
      type: 'int',
      isNullable: true,
      default: null,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('quotes', 'property_count');
  }
}
