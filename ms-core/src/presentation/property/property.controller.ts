import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CreatePropertiesBulkUseCase } from '../../application/property/use-cases/create-properties-bulk.use-case';
import { GetPropertiesByQuoteUseCase } from '../../application/property/use-cases/get-properties-by-quote.use-case';
import { UpdatePropertyUseCase } from '../../application/property/use-cases/update-property.use-case';
import { DeletePropertiesByQuoteUseCase } from '../../application/property/use-cases/delete-properties-by-quote.use-case';
import { UpdatePropertyDto } from '../../application/property/dto/update-property.dto';
import {
  PropertyResponseDto,
  PropertiesListResponseDto,
} from '../../application/property/dto/property-response.dto';

@Controller()
export class PropertyController {
  constructor(
    private readonly createPropertiesBulkUseCase: CreatePropertiesBulkUseCase,
    private readonly getPropertiesByQuoteUseCase: GetPropertiesByQuoteUseCase,
    private readonly updatePropertyUseCase: UpdatePropertyUseCase,
    private readonly deletePropertiesByQuoteUseCase: DeletePropertiesByQuoteUseCase,
  ) {}

  @Post('quotes/:quoteId/properties/bulk')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPropertiesBulk(
    @Param('quoteId') quoteId: string,
    @Body('count') count: number,
  ): Promise<{ properties: PropertyResponseDto[] }> {
    const properties = await this.createPropertiesBulkUseCase.execute({
      quoteId,
      count,
    });

    return {
      properties: properties.map(
        (p) =>
          new PropertyResponseDto({
            id: p.id,
            quoteId: p.quoteId,
            name: p.name,
            address: p.address,
            construction: p.construction,
            coverages: p.coverages,
            status: p.status,
            completionPercentage: p.completionPercentage,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }),
      ),
    };
  }

  @Get('quotes/:quoteId/properties')
  async getPropertiesByQuote(
    @Param('quoteId') quoteId: string,
  ): Promise<PropertiesListResponseDto> {
    const properties = await this.getPropertiesByQuoteUseCase.execute({
      quoteId,
    });

    const responseDtos = properties.map(
      (p) =>
        new PropertyResponseDto({
          id: p.id,
          quoteId: p.quoteId,
          name: p.name,
          address: p.address,
          construction: p.construction,
          coverages: p.coverages,
          status: p.status,
          completionPercentage: p.completionPercentage,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }),
    );

    return new PropertiesListResponseDto(responseDtos);
  }

  @Patch('properties/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProperty(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
  ): Promise<PropertyResponseDto> {
    const property = await this.updatePropertyUseCase.execute({
      id,
      name: dto.name,
      street: dto.street,
      neighborhood: dto.neighborhood,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
      constructionType: dto.constructionType,
      constructionYear: dto.constructionYear,
      levels: dto.levels,
      propertyUsage: dto.propertyUsage,
      specificActivity: dto.specificActivity,
      activityCode: dto.activityCode,
      coverageBuilding: dto.coverageBuilding,
      coverageContents: dto.coverageContents,
      coverageElectronic: dto.coverageElectronic,
      coverageMachinery: dto.coverageMachinery,
      coverageStock: dto.coverageStock,
    });

    return new PropertyResponseDto({
      id: property.id,
      quoteId: property.quoteId,
      name: property.name,
      address: property.address,
      construction: property.construction,
      coverages: property.coverages,
      status: property.status,
      completionPercentage: property.completionPercentage,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    });
  }

  @Delete('quotes/:quoteId/properties')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePropertiesByQuote(
    @Param('quoteId') quoteId: string,
  ): Promise<void> {
    await this.deletePropertiesByQuoteUseCase.execute({ quoteId });
  }

  // Endpoint para validar CP (placeholder - integrar con API de SEPOMEX)
  @Get('cp/:cp/validate')
  async validateZipCode(
    @Param('cp') cp: string,
  ): Promise<{ valid: boolean; message: string }> {
    // Validación básica de formato
    if (!/^\d{5}$/.test(cp)) {
      return { valid: false, message: 'Código postal debe tener 5 dígitos' };
    }
    // TODO: Integrar con API de SEPOMEX
    // Por ahora, aceptamos cualquier CP con formato válido
    return { valid: true, message: 'Código postal válido' };
  }

  // Endpoint para buscar clave de giro (placeholder)
  @Get('activities/search')
  async searchActivity(
    @Query('query') query: string,
  ): Promise<{ code: string; description: string }[]> {
    if (!query || query.length < 3) {
      return [];
    }
    // TODO: Integrar con catálogo de actividades SAT
    // Placeholder: retornar resultados simulados
    const activities = [
      { code: '461110', description: 'Comercio al por mayor de abarrotes' },
      { code: '461121', description: 'Comercio al por mayor de bebidas' },
      { code: '461122', description: 'Comercio al por mayor de cigarros' },
      { code: '462111', description: 'Comercio al por mayor de productos textiles' },
      { code: '463111', description: 'Comercio al por mayor de calzado' },
      { code: '464111', description: 'Comercio al por mayor de mobiliario' },
      { code: '465111', description: 'Comercio al por mayor de artículos electrónicos' },
      { code: '466111', description: 'Comercio al por mayor de maquinaria' },
      { code: '531111', description: 'Servicios de telecomunicaciones' },
      { code: '561111', description: 'Restaurantes con servicio de mesa' },
    ];
    
    return activities.filter(a => 
      a.description.toLowerCase().includes(query.toLowerCase()) ||
      a.code.includes(query)
    );
  }
}
