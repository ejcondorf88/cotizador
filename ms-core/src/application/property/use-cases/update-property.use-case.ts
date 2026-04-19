import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Property } from '../../../domain/property/entities/property.entity';
import { PropertyRepositoryPort } from '../../../domain/property/ports/property.repository.port';
import { ConstructionType } from '../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../domain/property/enums/property-usage.enum';
import { StructuredLogger } from '../../../common/logger/logger.service';

interface UpdatePropertyInput {
  id: string;
  name?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  insuredValue?: number;
  constructionType?: ConstructionType;
  usage?: PropertyUsage;
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

      // Validate insured value if provided
      if (input.insuredValue !== undefined) {
        if (input.insuredValue < 0) {
          throw new BadRequestException('Insured value must be positive');
        }
        if (input.insuredValue > 100000000) {
          throw new BadRequestException('Maximum insured value is $100,000,000 MXN');
        }
      }

      // Build update data
      const updateData: Partial<Property> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.street !== undefined || input.neighborhood !== undefined ||
          input.city !== undefined || input.state !== undefined || input.zipCode !== undefined) {
        updateData.address = {
          street: input.street ?? existing.address.street,
          neighborhood: input.neighborhood ?? existing.address.neighborhood,
          city: input.city ?? existing.address.city,
          state: input.state ?? existing.address.state,
          zipCode: input.zipCode ?? existing.address.zipCode,
        };
      }
      if (input.insuredValue !== undefined) updateData.insuredValue = input.insuredValue;
      if (input.constructionType !== undefined) updateData.constructionType = input.constructionType;
      if (input.usage !== undefined) updateData.usage = input.usage;

      const updated = await this.propertyRepo.update(id, updateData);

      this.logger.info(
        'application',
        'UpdatePropertyUseCase',
        'USE_CASE_SUCCESS',
        'Property updated successfully',
        { propertyId: id, completionPercentage: updated.completionPercentage },
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
