import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { QuoteTypeOrmEntity } from '../../quote/entities/quote.typeorm.entity';
import { PropertyTypeOrmEntity } from '../../property/entities/property.typeorm.entity';

@Entity('premium_breakdowns')
@Unique('UQ_PREMIUM_BREAKDOWN_QUOTE_PROPERTY_COVERAGE', [
  'quoteId',
  'propertyId',
  'coverageCode',
])
export class PremiumBreakdownTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quote_id' })
  @Index()
  quoteId: string;

  @Column({ name: 'property_id' })
  @Index()
  propertyId: string;

  @Column({ name: 'coverage_code', length: 30 })
  @Index()
  coverageCode: string;

  @Column({ name: 'coverage_name', length: 100 })
  coverageName: string;

  @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => QuoteTypeOrmEntity, (quote) => quote.properties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quote_id' })
  quote: QuoteTypeOrmEntity;

  @ManyToOne(() => PropertyTypeOrmEntity, (property) => property.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'property_id' })
  property: PropertyTypeOrmEntity;
}
