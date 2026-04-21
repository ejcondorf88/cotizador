import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('giros', { schema: 'catalog' })
@Index(['clave'], { unique: true })
@Index(['activo'])
@Index(['descripcion'])
export class GiroTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'clave', type: 'varchar', length: 20, unique: true })
  clave: string;

  @Column({ name: 'descripcion', type: 'varchar', length: 500 })
  descripcion: string;

  @Column({ name: 'sector', type: 'varchar', length: 100, nullable: true })
  sector: string | null;

  @Column({ name: 'riesgo', type: 'varchar', length: 20, default: 'MEDIO' })
  riesgo: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
