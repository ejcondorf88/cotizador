import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Property } from '../../../domain/property/entities/property.entity';
import { PropertyRepositoryPort } from '../../../domain/property/ports/property.repository.port';
import { ConstructionType } from '../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../domain/property/enums/property-usage.enum';
import { StructuredLogger } from '../../../common/logger/logger.service';

interface UpdatePropertyInput {
  id: string;
  // Ubicación
  name?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  // Construcción
  constructionType?: ConstructionType;
  constructionYear?: number;
  levels?: number;
  propertyUsage?: PropertyUsage;
  specificActivity?: string;
  activityCode?: string;
  // Garantías
  coverageBuilding?: number;
  coverageContents?: number;
  coverageElectronic?: number;
  coverageMachinery?: number;
  coverageStock?: number;
}

@Injectable()
export class UpdatePropertyUseCase {
  constructor(
    @Inject('PropertyRepositoryPort')
    private readonly propertyRepo: PropertyRepositoryPort,
    private readonly logger: StructuredLogger,
  ) {}

  async execute(input: UpdatePropertyInput): Promise<Property> {
    const { id } = input;

    this.logger.info(
      'application',
      'UpdatePropertyUseCase',
      'USE_CASE_START',
      'Updating property',
      { propertyId: id },
    );

    try {
      // Check if property exists
      const existing = await this.propertyRepo.findById(id);
      if (!existing) {
        this.logger.warn(
          'application',
          'UpdatePropertyUseCase',
          'PROPERTY_NOT_FOUND',
          'Property not found',
          { propertyId: id },
        );
        throw new NotFoundException(`Property with id ${id} not found`);
      }

      // Validate zip code if provided
      if (input.zipCode && !/^\d{5}$/.test(input.zipCode)) {
        throw new BadRequestException('Zip code must be exactly 5 digits');
      }

      // Validate construction year
      if (input.constructionYear !== undefined) {
        const currentYear = new Date().getFullYear();
        if (input.constructionYear < 1900 || input.constructionYear > currentYear) {
          throw new BadRequestException(`Construction year must be between 1900 and ${currentYear}`);
        }
      }

      // Validate coverage values
      const coverages = [
        { value: input.coverageBuilding, max: 100000000, name: 'Building' },
        { value: input.coverageContents, max: 50000000, name: 'Contents' },
        { value: input.coverageElectronic, max: 20000000, name: 'Electronic equipment' },
        { value: input.coverageMachinery, max: 30000000, name: 'Machinery' },
        { value: input.coverageStock, max: 20000000, name: 'Stock' },
      ];

      for (const coverage of coverages) {
        if (coverage.value !== undefined) {
          if (coverage.value < 0) {
            throw new BadRequestException(`${coverage.name} coverage must be positive`);
          }
          if (coverage.value > coverage.max) {
            throw new BadRequestException(`Maximum ${coverage.name.toLowerCase()} coverage is $${coverage.max.toLocaleString()} MXN`);
          }
        }
      }

// Build update data
const updateData: Partial<Property> = {};

// Ubicación
if (input.name !== undefined || input.street !== undefined ||
    input.neighborhood !== undefined || input.city !== undefined ||
    input.state !== undefined || input.zipCode !== undefined) {
  updateData.name = input.name ?? existing.name;
  updateData.address = {
    street: input.street ?? existing.address.street,
    neighborhood: input.neighborhood ?? existing.address.neighborhood,
    city: input.city ?? existing.address.city,
    state: input.state ?? existing.address.state,
    zipCode: input.zipCode ?? existing.address.zipCode,
  };
}

      // Construcción
      if (input.constructionType !== undefined || input.constructionYear !== undefined ||
          input.levels !== undefined || input.propertyUsage !== undefined ||
          input.specificActivity !== undefined || input.activityCode !== undefined) {
        updateData.construction = {
          type: input.constructionType ?? existing.construction.type,
          year: input.constructionYear ?? existing.construction.year,
          levels: input.levels ?? existing.construction.levels,
          usage: input.propertyUsage ?? existing.construction.usage,
          specificActivity: input.specificActivity ?? existing.construction.specificActivity,
          activityCode: input.activityCode ?? existing.construction.activityCode,
        };
      }

      // Garantías
      if (input.coverageBuilding !== undefined || input.coverageContents !== undefined ||
          input.coverageElectronic !== undefined || input.coverageMachinery !== undefined ||
          input.coverageStock !== undefined) {
        updateData.coverages = {
          building: input.coverageBuilding ?? existing.coverages.building,
          contents: input.coverageContents ?? existing.coverages.contents,
          electronicEquipment: input.coverageElectronic ?? existing.coverages.electronicEquipment,
          machinery: input.coverageMachinery ?? existing.coverages.machinery,
          stock: input.coverageStock ?? existing.coverages.stock,
        };
      }

      const updated = await this.propertyRepo.update(id, updateData);

      this.logger.info(
        'application',
        'UpdatePropertyUseCase',
        'USE_CASE_SUCCESS',
        'Property updated successfully',
        { 
          propertyId: id, 
          status: updated.status,
          completionPercentage: updated.completionPercentage,
          totalCoverage: updated.getTotalCoverage(),
        },
      );

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        'application',
        'UpdatePropertyUseCase',
        'USE_CASE_ERROR',
        'Failed to update property',
        error as Error,
        { propertyId: id },
      );
      throw error;
    }
  }
}
