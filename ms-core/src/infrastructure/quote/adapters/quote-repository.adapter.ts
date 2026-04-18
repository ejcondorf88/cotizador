import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '../../../domain/quote/entities/quote.entity';
import { QuoteRepositoryPort } from '../../../domain/quote/ports/quote.repository.port';
import { QuoteTypeOrmEntity } from '../entities/quote.typeorm.entity';
import { QuoteMapper } from '../mappers/quote.mapper';

@Injectable()
export class QuoteRepositoryAdapter implements QuoteRepositoryPort {
  constructor(
    @InjectRepository(QuoteTypeOrmEntity)
    private readonly quoteRepo: Repository<QuoteTypeOrmEntity>,
  ) {}

  async create(quote: Quote): Promise<Quote> {
    const entity = QuoteMapper.toEntity(quote);
    const saved = await this.quoteRepo.save(entity);
    return QuoteMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Quote | null> {
    const entity = await this.quoteRepo.findOne({ where: { id } });
    return entity ? QuoteMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Quote[]> {
    const entities = await this.quoteRepo.find();
    return entities.map(QuoteMapper.toDomain);
  }

  async getLastFolioOfYear(year: number): Promise<number> {
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
}
