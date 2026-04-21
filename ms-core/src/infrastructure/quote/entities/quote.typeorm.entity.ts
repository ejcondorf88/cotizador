import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PropertyTypeOrmEntity } from '../../property/entities/property.typeorm.entity';

@Entity('quotes')
export class QuoteTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'folio_number', unique: true, length: 20 })
  folioNumber: string;

  @Column({ name: 'status', default: 'DRAFT', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Asegurado
  @Column({ name: 'company_name', nullable: true, length: 150 })
  companyName: string;

  @Column({ name: 'rfc', nullable: true, length: 13 })
  rfc: string;

  @Column({ name: 'business_line', nullable: true, length: 50 })
  businessLine: string;

  @Column({ name: 'business_type', nullable: true, length: 50 })
  businessType: string;

  // Conducción
  @Column({ name: 'agent_key', nullable: true, length: 20 })
  agentKey: string;

  @Column({ name: 'agent_name', nullable: true, length: 100 })
  agentName: string;

  @Column({ name: 'subscriber', nullable: true, length: 100 })
  subscriber: string;

  @Column({ name: 'office', nullable: true, length: 100 })
  office: string;

  // Vigencia
  @Column({ name: 'validity_start', nullable: true, type: 'timestamp' })
  validityStart: Date;

  @Column({ name: 'validity_end', nullable: true, type: 'timestamp' })
  validityEnd: Date;

  @Column({ name: 'currency', nullable: true, length: 3, default: 'MXN' })
  currency: string;

  @Column({ name: 'payment_type', nullable: true, length: 20 })
  paymentType: string;

  // Inmuebles
  @Column({ name: 'property_count', nullable: true, type: 'int' })
  propertyCount: number;

  @OneToMany(() => PropertyTypeOrmEntity, (property) => property.quote, {
    cascade: true,
  })
  properties: PropertyTypeOrmEntity[];

  // Prima y cálculo
  @Column({ name: 'net_premium', nullable: true, type: 'decimal', precision: 12, scale: 2 })
  netPremium: number;

  @Column({ name: 'commercial_premium', nullable: true, type: 'decimal', precision: 12, scale: 2 })
  commercialPremium: number;

  @Column({ name: 'commercial_factor', default: 1.2, type: 'decimal', precision: 4, scale: 2 })
  commercialFactor: number;

  @Column({ name: 'calculated_at', nullable: true, type: 'timestamp' })
  calculatedAt: Date;

  @Column({ name: 'version', default: 1, type: 'int' })
  version: number;
}
