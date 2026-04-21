import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('oficinas', { schema: 'catalog' })
@Index(['codigo'], { unique: true })
@Index(['activo'])
@Index(['estado'])
export class OficinaTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo', type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ name: 'nombre', type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'ciudad', type: 'varchar', length: 100, nullable: true })
  ciudad: string | null;

  @Column({ name: 'estado', type: 'varchar', length: 50, nullable: true })
  estado: string | null;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
