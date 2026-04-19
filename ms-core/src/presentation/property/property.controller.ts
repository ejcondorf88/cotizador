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
} from '@nestjs/common';
import { CreatePropertiesBulkUseCase } from '../../application/property/use-cases/create-properties-bulk.use-case';
import { GetPropertiesByQuoteUseCase } from '../../application/property/use-cases/get-properties-by-quote.use-case';
import { UpdatePropertyUseCase } from '../../application/property/use-cases/update-property.use-case';
import { DeletePropertiesByQuoteUseCase } from '../../application/property/use-cases/delete-properties-by-quote.use-case';
import { CreatePropertyDto } from '../../application/property/dto/create-property.dto';
import { UpdatePropertyDto } from '../../application/property/dto/update-property.dto';
import {
  PropertyResponseDto,
  PropertiesListResponseDto,
} from '../../application/property/dto/property-response.dto';
import { ConstructionType } from '../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../domain/property/enums/property-usage.enum';

@Controller('api/v1')
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
            insuredValue: p.insuredValue,
            constructionType: p.constructionType,
            usage: p.usage,
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
          insuredValue: p.insuredValue,
          constructionType: p.constructionType,
          usage: p.usage,
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
      insuredValue: dto.insuredValue,
      constructionType: dto.constructionType,
      usage: dto.usage,
    });

    return new PropertyResponseDto({
      id: property.id,
      quoteId: property.quoteId,
      name: property.name,
      address: property.address,
      insuredValue: property.insuredValue,
      constructionType: property.constructionType,
      usage: property.usage,
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
}
