import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { QuoteTypeOrmEntity } from '../../quote/entities/quote.typeorm.entity';

export enum ConstructionType {
  CONCRETO = 'CONCRETO',
  ACERO = 'ACERO',
  MAMPOSTERIA = 'MAMPOSTERIA',
  MADERA = 'MADERA',
  OTRO = 'OTRO',
}

export enum PropertyUsage {
  COMERCIAL = 'COMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  OFICINA = 'OFICINA',
  RESIDENCIAL = 'RESIDENCIAL',
  MIXTO = 'MIXTO',
}

export enum PropertyStatus {
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
}

@Entity('properties')
export class PropertyTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quote_id' })
  @Index()
  quoteId: string;

  // ========== UBICACIÓN ==========
  @Column({ name: 'name', length: 100 })
  name: string;

  @Column({ name: 'street', length: 200 })
  street: string;

  @Column({ name: 'neighborhood', length: 100 })
  neighborhood: string;

  @Column({ name: 'city', length: 100 })
  city: string;

  @Column({ name: 'state', length: 50 })
  state: string;

  @Column({ name: 'zip_code', length: 5 })
  zipCode: string;

  // ========== CONSTRUCCIÓN ==========
  @Column({ name: 'construction_type', type: 'enum', enum: ConstructionType })
  constructionType: ConstructionType;

  @Column({ name: 'construction_year', nullable: true, type: 'int' })
  constructionYear: number;

  @Column({ name: 'levels', nullable: true, type: 'int' })
  levels: number;

  @Column({ name: 'property_usage', type: 'enum', enum: PropertyUsage })
  propertyUsage: PropertyUsage;

  @Column({ name: 'specific_activity', length: 100 })
  specificActivity: string;

  @Column({ name: 'activity_code', length: 20, nullable: true })
  activityCode: string;

  // ========== GARANTÍAS (COBERTURAS) ==========
  @Column({ name: 'coverage_building', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageBuilding: number;

  @Column({ name: 'coverage_contents', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageContents: number;

  @Column({ name: 'coverage_electronic', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageElectronic: number;

  @Column({ name: 'coverage_machinery', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageMachinery: number;

  @Column({ name: 'coverage_stock', type: 'decimal', precision: 15, scale: 2, default: 0 })
  coverageStock: number;

  // ========== ESTADO ==========
  @Column({ name: 'status', type: 'enum', enum: PropertyStatus, default: PropertyStatus.INCOMPLETE })
  status: PropertyStatus;

  @Column({ name: 'completion_percentage', type: 'int', default: 0 })
  completionPercentage: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Prima y cálculo
  @Column({ name: 'net_premium', nullable: true, type: 'decimal', precision: 12, scale: 2 })
  netPremium: number;

  @Column({ name: 'commercial_premium', nullable: true, type: 'decimal', precision: 12, scale: 2 })
  commercialPremium: number;

  @Column({ name: 'incomplete_reason', nullable: true, type: 'text' })
  incompleteReason: string;

  @ManyToOne(() => QuoteTypeOrmEntity, (quote) => quote.properties)
  @JoinColumn({ name: 'quote_id' })
  quote: QuoteTypeOrmEntity;
}
