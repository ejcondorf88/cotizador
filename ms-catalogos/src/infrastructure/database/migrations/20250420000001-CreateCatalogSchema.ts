import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCatalogSchema20250420000001 implements MigrationInterface {
  name = 'CreateCatalogSchema20250420000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('catalog', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema('catalog', true, true);
  }
}
