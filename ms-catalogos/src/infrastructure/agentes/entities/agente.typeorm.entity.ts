import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { OficinaTypeOrmEntity } from '../../oficinas/entities/oficina.typeorm.entity';

@Entity('agentes', { schema: 'catalog' })
@Index(['codigo'], { unique: true })
@Index(['activo'])
@Index(['nombre'])
export class AgenteTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo', type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email: string | null;

  @Column({ name: 'telefono', type: 'varchar', length: 20, nullable: true })
  telefono: string | null;

  @Column({ name: 'oficina_id', type: 'uuid', nullable: true })
  oficinaId: string | null;

  @ManyToOne(() => OficinaTypeOrmEntity, { nullable: true })
  @JoinColumn({ name: 'oficina_id' })
  oficina: OficinaTypeOrmEntity | null;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
