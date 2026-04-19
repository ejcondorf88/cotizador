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

@Entity('properties')
export class PropertyTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quote_id' })
  @Index()
  quoteId: string;

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

  @Column({ name: 'insured_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
  insuredValue: number;

  @Column({ name: 'construction_type', type: 'enum', enum: ConstructionType, nullable: true })
  constructionType: ConstructionType | null;

  @Column({ name: 'usage', type: 'enum', enum: PropertyUsage, nullable: true })
  usage: PropertyUsage | null;

  @Column({ name: 'completion_percentage', type: 'int', default: 0 })
  completionPercentage: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => QuoteTypeOrmEntity, (quote) => quote.properties)
  @JoinColumn({ name: 'quote_id' })
  quote: QuoteTypeOrmEntity;
}
