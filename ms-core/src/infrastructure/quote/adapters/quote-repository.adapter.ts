import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Quote } from '../../../domain/quote/entities/quote.entity';
import { QuoteRepositoryPort } from '../../../domain/quote/ports/quote.repository.port';
import { QuoteTypeOrmEntity } from '../entities/quote.typeorm.entity';
import { QuoteMapper } from '../mappers/quote.mapper';
import { StructuredLogger } from '../../../common/logger/logger.service';

@Injectable()
export class QuoteRepositoryAdapter implements QuoteRepositoryPort {
  constructor(
    @InjectRepository(QuoteTypeOrmEntity)
    private readonly quoteRepo: Repository<QuoteTypeOrmEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly logger: StructuredLogger,
  ) {}

  async create(quote: Quote): Promise<Quote> {
    const entity = QuoteMapper.toEntity(quote);
    const saved = await this.quoteRepo.save(entity);
    return QuoteMapper.toDomain(saved);
  }

  async createWithFolioNumber(year: number): Promise<Quote> {
    const txStartTime = Date.now();

    this.logger.info(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_TX_START',
      'Starting transaction for quote creation',
      { year, isolationLevel: 'SERIALIZABLE' },
    );

    return this.entityManager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        try {
          const queryStart = Date.now();
          const lastQuote = await transactionalEntityManager
            .createQueryBuilder(QuoteTypeOrmEntity, 'quote')
            .setLock('pessimistic_write')
            .where('quote.folioNumber LIKE :prefix', { prefix: `COT-${year}-%` })
            .orderBy('quote.folioNumber', 'DESC')
            .getOne();

          const queryDuration = Date.now() - queryStart;
          this.logger.debug(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'DB_QUERY',
            'Executed query to get last folio',
            {
              query: 'SELECT ... WITH LOCK',
              durationMs: queryDuration,
              found: !!lastQuote,
            },
          );

          let nextNumber = 1;
          if (lastQuote) {
            const match = lastQuote.folioNumber.match(/COT-\d{4}-(\d{5})/);
            if (match) {
              nextNumber = parseInt(match[1], 10) + 1;
            }
          }

          const folioNumber = `COT-${year}-${String(nextNumber).padStart(5, '0')}`;

          this.logger.debug(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'FOLIO_CALCULATED',
            'Calculated next folio number',
            { folioNumber, year, sequenceNumber: nextNumber },
          );

          const quote = Quote.create(folioNumber);
          const entity = QuoteMapper.toEntity(quote);

          const insertStart = Date.now();
          const saved = await transactionalEntityManager.save(QuoteTypeOrmEntity, entity);
          const insertDuration = Date.now() - insertStart;

          this.logger.debug(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'DB_INSERT',
            'Inserted quote into database',
            {
              quoteId: saved.id,
              folioNumber: saved.folioNumber,
              durationMs: insertDuration,
            },
          );

          const txDuration = Date.now() - txStartTime;
          this.logger.info(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'DB_TX_COMMIT',
            'Transaction committed successfully',
            {
              quoteId: saved.id,
              folioNumber: saved.folioNumber,
            },
            txDuration,
          );

          return QuoteMapper.toDomain(saved);
        } catch (error) {
          this.logger.error(
            'infrastructure',
            'QuoteRepositoryAdapter',
            'DB_TX_ROLLBACK',
            'Transaction rolled back due to error',
            error as Error,
            { year, durationMs: Date.now() - txStartTime },
          );
          throw error;
        }
      }
    );
  }

  async findById(id: string): Promise<Quote | null> {
    this.logger.debug(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_QUERY',
      'Finding quote by ID',
      { id },
    );
    const entity = await this.quoteRepo.findOne({ where: { id } });
    return entity ? QuoteMapper.toDomain(entity) : null;
  }

  async findByIdWithProperties(id: string): Promise<Quote | null> {
    this.logger.debug(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_QUERY',
      'Finding quote by ID with properties',
      { id },
    );
    const entity = await this.quoteRepo.findOne({
      where: { id },
      relations: ['properties'],
    });
    return entity ? QuoteMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Quote[]> {
    this.logger.debug(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_QUERY',
      'Finding all quotes',
    );
    const entities = await this.quoteRepo.find();
    return entities.map(QuoteMapper.toDomain);
  }

  async getLastFolioOfYear(year: number): Promise<number> {
    this.logger.debug(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_QUERY',
      'Getting last folio of year',
      { year },
    );
    const result = await this.quoteRepo
      .createQueryBuilder('quote')
      .where('quote.folioNumber LIKE :prefix', { prefix: `COT-${year}-%` })
      .orderBy('quote.createdAt', 'DESC')
      .getOne();

    if (!result) {
      return 0;
    }

    const match = result.folioNumber.match(/COT-\d{4}-(\d{5})/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async findByStatus(status: string): Promise<Quote[]> {
    this.logger.debug(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_QUERY',
      'Finding quotes by status',
      { status },
    );
    const entities = await this.quoteRepo.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
    return entities.map(QuoteMapper.toDomain);
  }

  async update(id: string, data: Partial<Quote>): Promise<Quote> {
    this.logger.info(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_UPDATE_START',
      'Updating quote',
      { quoteId: id },
    );

    const existing = await this.quoteRepo.findOne({ where: { id } });
    if (!existing) {
      throw new Error(`Quote with id ${id} not found`);
    }

    // Update fields
    if (data.status) existing.status = data.status;
    if (data.details) {
      if (data.details.companyName) existing.companyName = data.details.companyName;
      if (data.details.rfc) existing.rfc = data.details.rfc;
      if (data.details.businessLine) existing.businessLine = data.details.businessLine;
      if (data.details.businessType) existing.businessType = data.details.businessType;
      if (data.details.agentKey) existing.agentKey = data.details.agentKey;
      if (data.details.agentName) existing.agentName = data.details.agentName;
      if (data.details.subscriber) existing.subscriber = data.details.subscriber;
      if (data.details.office) existing.office = data.details.office;
      if (data.details.validityStart) existing.validityStart = data.details.validityStart;
      if (data.details.validityEnd) existing.validityEnd = data.details.validityEnd;
      if (data.details.currency) existing.currency = data.details.currency;
      if (data.details.paymentType) existing.paymentType = data.details.paymentType;
    }

    existing.updatedAt = new Date();

    const saved = await this.quoteRepo.save(existing);

    this.logger.info(
      'infrastructure',
      'QuoteRepositoryAdapter',
      'DB_UPDATE_SUCCESS',
      'Quote updated successfully',
      { quoteId: saved.id },
    );

    return QuoteMapper.toDomain(saved);
  }
}
