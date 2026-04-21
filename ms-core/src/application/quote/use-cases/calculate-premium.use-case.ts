import { Injectable, Inject, NotFoundException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Quote } from '../../../domain/quote/entities/quote.entity';
import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';
import { Property } from '../../../domain/property/entities/property.entity';
import { PropertyCalculationStatus } from '../../../domain/property/entities/property.entity';
import { PropertyTypeOrmEntity } from '../../../infrastructure/property/entities/property.typeorm.entity';
import { PremiumBreakdownTypeOrmEntity } from '../../../infrastructure/premium/entities/premium-breakdown.typeorm.entity';
import { QuoteTypeOrmEntity } from '../../../infrastructure/quote/entities/quote.typeorm.entity';
import { QuoteRepositoryPort, QUOTE_REPOSITORY_PORT } from '../../../domain/quote/ports/quote.repository.port';
import { StructuredLogger } from '../../../common/logger/logger.service';
import {
  PremiumCalculationResponseDto,
  PropertyResultDto,
  CoverageBreakdownDto,
} from '../dto/premium-calculation-response.dto';

interface CoverageRate {
  code: string;
  name: string;
  baseRate: number;
}

@Injectable()
export class CalculatePremiumUseCase {
  // Tasas base por cobertura (configurables desde BD en futuras versiones)
  private readonly coverageRates: CoverageRate[] = [
    { code: 'FIRE', name: 'Incendio y Rayo', baseRate: 0.001 },
    { code: 'CAT', name: 'CAT (Terremoto/Huracán)', baseRate: 0.002 },
    { code: 'GLASS', name: 'Rotura de Cristales', baseRate: 0.0005 },
    { code: 'WATER', name: 'Daños por Agua', baseRate: 0.0008 },
    { code: 'THEFT', name: 'Robo', baseRate: 0.0015 },
    { code: 'LIABILITY', name: 'Responsabilidad Civil', baseRate: 0.0003 },
    { code: 'ELECTRONIC', name: 'Equipo Electrónico', baseRate: 0.003 },
    { code: 'EXTRA_EXPENSES', name: 'Gastos Extraordinarios', baseRate: 0.0002 },
  ];

  constructor(
    @Inject(QUOTE_REPOSITORY_PORT)
    private readonly quoteRepo: QuoteRepositoryPort,
    @InjectRepository(PropertyTypeOrmEntity)
    private readonly propertyRepo: Repository<PropertyTypeOrmEntity>,
    @InjectRepository(PremiumBreakdownTypeOrmEntity)
    private readonly breakdownRepo: Repository<PremiumBreakdownTypeOrmEntity>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly logger: StructuredLogger,
  ) {}

  async getResult(quoteId: string): Promise<PremiumCalculationResponseDto> {
    const startTime = Date.now();
    this.logger.info(
      'application',
      'CalculatePremiumUseCase',
      'PREMIUM_RESULT_START',
      'Starting get premium result',
      { quoteId },
    );

    // 1. Obtener cotización con propiedades
    const quote = await this.quoteRepo.findById(quoteId);
    if (!quote) {
      this.logger.warn(
        'application',
        'CalculatePremiumUseCase',
        'QUOTE_NOT_FOUND',
        'Quote not found',
        { quoteId },
      );
      throw new NotFoundException(`Quote with id ${quoteId} not found`);
    }

    // 2. Verificar que la cotización haya sido calculada
    if (quote.status !== QuoteStatus.CALCULATED) {
      this.logger.warn(
        'application',
        'CalculatePremiumUseCase',
        'QUOTE_NOT_CALCULATED',
        'Quote has not been calculated yet',
        { quoteId, status: quote.status },
      );
      throw new UnprocessableEntityException(
        'La cotización no ha sido calculada aún',
      );
    }

    // 3. Obtener propiedades con breakdowns
    const properties = await this.propertyRepo.find({
      where: { quoteId },
      order: { createdAt: 'ASC' },
    });

    const propertyResults: PropertyResultDto[] = [];
    let calculatedCount = 0;
    let incompleteCount = 0;

    for (const prop of properties) {
      // Obtener breakdowns para esta propiedad
      const breakdowns = await this.breakdownRepo.find({
        where: { quoteId, propertyId: prop.id },
      });

      if (prop.status === PropertyCalculationStatus.CALCULATED) {
        calculatedCount++;
        propertyResults.push({
          propertyId: prop.id,
          name: prop.name,
          status: PropertyCalculationStatus.CALCULATED,
          netPremium: prop.netPremium,
          commercialPremium: prop.commercialPremium,
          breakdown: breakdowns.map((b) => ({
            coverageCode: b.coverageCode,
            coverageName: b.coverageName,
            amount: Number(b.amount),
          })),
        });
      } else {
        incompleteCount++;
        propertyResults.push({
          propertyId: prop.id,
          name: prop.name,
          status: PropertyCalculationStatus.INCOMPLETE,
          incompleteReason: prop.incompleteReason,
          breakdown: [],
        });
      }
    }

    // 4. Generar alertas
    const alerts: string[] = [];
    if (incompleteCount > 0) {
      alerts.push(
        `${incompleteCount} inmueble(s) no fueron calculados por datos incompletos. La prima mostrada no los incluye.`,
      );
    }

    const duration = Date.now() - startTime;
    this.logger.info(
      'application',
      'CalculatePremiumUseCase',
      'PREMIUM_RESULT_SUCCESS',
      'Premium result retrieved successfully',
      {
        quoteId,
        calculatedCount,
        incompleteCount,
        duration,
      },
    );

    return {
      folio: quote.folioNumber,
      status: QuoteStatus.CALCULATED,
      version: quote.version,
      netPremium: quote.netPremium || 0,
      commercialPremium: quote.commercialPremium || 0,
      commercialFactor: quote.commercialFactor || 1.2,
      calculatedAt: quote.calculatedAt?.toISOString() || new Date().toISOString(),
      propertiesCalculated: calculatedCount,
      propertiesTotal: properties.length,
      properties: propertyResults,
      alerts,
    };
  }

  async execute(quoteId: string): Promise<PremiumCalculationResponseDto> {
    const startTime = Date.now();
    this.logger.info(
      'application',
      'CalculatePremiumUseCase',
      'PREMIUM_CALCULATION_START',
      'Starting premium calculation',
      { quoteId },
    );

    return this.entityManager.transaction(async (transactionalEntityManager) => {
      // 1. Obtener cotización con propiedades
      const quote = await this.quoteRepo.findById(quoteId);
      if (!quote) {
        this.logger.warn(
          'application',
          'CalculatePremiumUseCase',
          'QUOTE_NOT_FOUND',
          'Quote not found',
          { quoteId },
        );
        throw new NotFoundException(`Quote with id ${quoteId} not found`);
      }

      // 2. Obtener propiedades con coberturas
      const properties = await transactionalEntityManager
        .getRepository(PropertyTypeOrmEntity)
        .find({
          where: { quoteId },
          order: { createdAt: 'ASC' },
        });

      if (properties.length === 0) {
        this.logger.warn(
          'application',
          'CalculatePremiumUseCase',
          'NO_PROPERTIES',
          'Quote has no properties',
          { quoteId },
        );
        throw new UnprocessableEntityException('Quote has no properties');
      }

      // 3. Eliminar breakdowns anteriores (idempotencia)
      await transactionalEntityManager
        .getRepository(PremiumBreakdownTypeOrmEntity)
        .delete({ quoteId });

      // 4. Procesar cada propiedad
      const propertyResults: PropertyResultDto[] = [];
      let totalNetPremium = 0;
      let calculatedCount = 0;
      const alerts: string[] = [];
      let incompleteCount = 0;

      for (const prop of properties) {
        const propertyResult = await this.processProperty(
          prop,
          quoteId,
          transactionalEntityManager,
        );

        propertyResults.push(propertyResult);

        if (propertyResult.status === PropertyCalculationStatus.CALCULATED) {
          totalNetPremium += propertyResult.netPremium || 0;
          calculatedCount++;

          // Actualizar propiedad en BD
          await transactionalEntityManager
            .getRepository(PropertyTypeOrmEntity)
            .update(prop.id, {
              netPremium: propertyResult.netPremium,
              commercialPremium: propertyResult.commercialPremium,
              incompleteReason: null,
            });
        } else {
          incompleteCount++;

          // Actualizar propiedad con razón de incompletitud
          await transactionalEntityManager
            .getRepository(PropertyTypeOrmEntity)
            .update(prop.id, {
              netPremium: null,
              commercialPremium: null,
              incompleteReason: propertyResult.incompleteReason,
            });
        }
      }

      // 5. Verificar que al menos un inmueble sea calculable
      if (calculatedCount === 0) {
        this.logger.warn(
          'application',
          'CalculatePremiumUseCase',
          'NO_CALCULABLE_PROPERTIES',
          'No calculable properties found',
          { quoteId },
        );
        throw new UnprocessableEntityException(
          'No hay inmuebles con datos suficientes para calcular la prima',
        );
      }

      // 6. Calcular totales del folio
      const commercialFactor = 1.2;
      const commercialPremium = totalNetPremium * commercialFactor;

      // 7. Actualizar cotización
      await transactionalEntityManager
        .getRepository(QuoteTypeOrmEntity)
        .update(quoteId, {
          netPremium: totalNetPremium,
          commercialPremium: commercialPremium,
          commercialFactor: commercialFactor,
          calculatedAt: new Date(),
          status: QuoteStatus.CALCULATED,
        });

      // 8. Generar alertas
      if (incompleteCount > 0) {
        alerts.push(
          `${incompleteCount} inmueble(s) no fueron calculados por datos incompletos. La prima mostrada no los incluye.`,
        );
      }

      const duration = Date.now() - startTime;
      this.logger.info(
        'application',
        'CalculatePremiumUseCase',
        'PREMIUM_CALCULATION_SUCCESS',
        'Premium calculation completed successfully',
        {
          quoteId,
          calculatedCount,
          incompleteCount,
          totalNetPremium,
          commercialPremium,
          duration,
        },
      );

      return {
        folio: quote.folioNumber,
        status: QuoteStatus.CALCULATED,
        version: quote.version + 1,
        netPremium: totalNetPremium,
        commercialPremium,
        commercialFactor,
        calculatedAt: new Date().toISOString(),
        propertiesCalculated: calculatedCount,
        propertiesTotal: properties.length,
        properties: propertyResults,
        alerts,
      };
    });
  }

  private async processProperty(
    prop: PropertyTypeOrmEntity,
    quoteId: string,
    transactionalEntityManager: EntityManager,
  ): Promise<PropertyResultDto> {
    // Validar si la propiedad es calculable
    const validationErrors: string[] = [];

    // Validar zipCode (5 dígitos)
    if (!/^\d{5}$/.test(prop.zipCode || '')) {
      validationErrors.push('Falta código postal válido (5 dígitos)');
    }

    // Validar activityCode
    if (!prop.activityCode || prop.activityCode.trim().length === 0) {
      validationErrors.push('Falta código de actividad económica');
    }

    // Validar que tenga al menos un coverage > 0
    const totalCoverage =
      (prop.coverageBuilding || 0) +
      (prop.coverageContents || 0) +
      (prop.coverageElectronic || 0) +
      (prop.coverageMachinery || 0) +
      (prop.coverageStock || 0);

    if (totalCoverage <= 0) {
      validationErrors.push('No tiene valores asegurados configurados');
    }

    // Si hay errores, retornar como INCOMPLETE
    if (validationErrors.length > 0) {
      return {
        propertyId: prop.id,
        name: prop.name,
        status: PropertyCalculationStatus.INCOMPLETE,
        incompleteReason: validationErrors.join('. '),
        breakdown: [],
      };
    }

    // Calcular suma asegurada
    const sumInsured = totalCoverage;

    // Calcular prima por cada cobertura
    const breakdown: CoverageBreakdownDto[] = [];
    let netPremium = 0;

    for (const coverage of this.coverageRates) {
      const amount = sumInsured * coverage.baseRate;
      breakdown.push({
        coverageCode: coverage.code,
        coverageName: coverage.name,
        amount: Math.round(amount * 100) / 100,
      });
      netPremium += amount;

      // Guardar breakdown en BD
      const breakdownEntity = transactionalEntityManager.create(PremiumBreakdownTypeOrmEntity, {
        quoteId,
        propertyId: prop.id,
        coverageCode: coverage.code,
        coverageName: coverage.name,
        amount: Math.round(amount * 100) / 100,
      });
      await transactionalEntityManager.save(breakdownEntity);
    }

    // Calcular prima comercial
    const commercialFactor = 1.2;
    const commercialPremium = netPremium * commercialFactor;

    return {
      propertyId: prop.id,
      name: prop.name,
      status: PropertyCalculationStatus.CALCULATED,
      netPremium: Math.round(netPremium * 100) / 100,
      commercialPremium: Math.round(commercialPremium * 100) / 100,
      breakdown,
    };
  }
}
