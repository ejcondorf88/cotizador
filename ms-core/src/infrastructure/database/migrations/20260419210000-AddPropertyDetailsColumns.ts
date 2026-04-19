import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPropertyDetailsColumns20260419210000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columnas antiguas
    await queryRunner.dropColumn('properties', 'insured_value');
    await queryRunner.dropColumn('properties', 'usage');
    
    // Hacer construction_type no nullable
    await queryRunner.changeColumn('properties', 'construction_type', 
      new TableColumn({
        name: 'construction_type',
        type: 'enum',
        enum: ['CONCRETO', 'ACERO', 'MAMPOSTERIA', 'MADERA', 'OTRO'],
        isNullable: false,
      })
    );

    // Agregar columnas de construcción
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'construction_year',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'levels',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'property_usage',
      type: 'enum',
      enum: ['COMERCIAL', 'INDUSTRIAL', 'OFICINA', 'RESIDENCIAL', 'MIXTO'],
      isNullable: false,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'specific_activity',
      type: 'varchar',
      length: '100',
      isNullable: false,
      default: "''",
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'activity_code',
      type: 'varchar',
      length: '20',
      isNullable: true,
    }));

    // Agregar columnas de garantías (coberturas)
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'coverage_building',
      type: 'decimal',
      precision: 15,
      scale: 2,
      default: 0,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'coverage_contents',
      type: 'decimal',
      precision: 15,
      scale: 2,
      default: 0,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'coverage_electronic',
      type: 'decimal',
      precision: 15,
      scale: 2,
      default: 0,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'coverage_machinery',
      type: 'decimal',
      precision: 15,
      scale: 2,
      default: 0,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'coverage_stock',
      type: 'decimal',
      precision: 15,
      scale: 2,
      default: 0,
    }));

    // Agregar columna de estado
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'status',
      type: 'enum',
      enum: ['INCOMPLETE', 'COMPLETE'],
      default: "'INCOMPLETE'",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir cambios
    await queryRunner.dropColumn('properties', 'status');
    await queryRunner.dropColumn('properties', 'coverage_stock');
    await queryRunner.dropColumn('properties', 'coverage_machinery');
    await queryRunner.dropColumn('properties', 'coverage_electronic');
    await queryRunner.dropColumn('properties', 'coverage_contents');
    await queryRunner.dropColumn('properties', 'coverage_building');
    await queryRunner.dropColumn('properties', 'activity_code');
    await queryRunner.dropColumn('properties', 'specific_activity');
    await queryRunner.dropColumn('properties', 'property_usage');
    await queryRunner.dropColumn('properties', 'levels');
    await queryRunner.dropColumn('properties', 'construction_year');
    
    // Restaurar columnas antiguas
    await queryRunner.addColumn('properties', new TableColumn({
      name: 'usage',
      type: 'enum',
      enum: ['COMERCIAL', 'INDUSTRIAL', 'OFICINA', 'RESIDENCIAL', 'MIXTO'],
      isNullable: true,
    }));

    await queryRunner.addColumn('properties', new TableColumn({
      name: 'insured_value',
      type: 'decimal',
      precision: 15,
      scale: 2,
      default: 0,
    }));

    await queryRunner.changeColumn('properties', 'construction_type',
      new TableColumn({
        name: 'construction_type',
        type: 'enum',
        enum: ['CONCRETO', 'ACERO', 'MAMPOSTERIA', 'MADERA', 'OTRO'],
        isNullable: true,
      })
    );
  }
}
