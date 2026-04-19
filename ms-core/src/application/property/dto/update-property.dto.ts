import { IsString, IsNumber, IsOptional, IsEnum, Min, Max, MaxLength, Matches } from 'class-validator';
import { ConstructionType } from '../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../domain/property/enums/property-usage.enum';

export class UpdatePropertyDto {
  // ========== UBICACIÓN ==========
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  street?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  neighborhood?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  @Matches(/^\d{5}$/, { message: 'Zip code must be exactly 5 digits' })
  zipCode?: string;

  // ========== CONSTRUCCIÓN ==========
  @IsOptional()
  @IsEnum(ConstructionType)
  constructionType?: ConstructionType;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  constructionYear?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  levels?: number;

  @IsOptional()
  @IsEnum(PropertyUsage)
  propertyUsage?: PropertyUsage;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  specificActivity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  activityCode?: string;

  // ========== GARANTÍAS (COBERTURAS) ==========
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100000000, { message: 'Maximum building coverage is $100,000,000 MXN' })
  coverageBuilding?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50000000, { message: 'Maximum contents coverage is $50,000,000 MXN' })
  coverageContents?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20000000, { message: 'Maximum electronic equipment coverage is $20,000,000 MXN' })
  coverageElectronic?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(30000000, { message: 'Maximum machinery coverage is $30,000,000 MXN' })
  coverageMachinery?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20000000, { message: 'Maximum stock coverage is $20,000,000 MXN' })
  coverageStock?: number;
}
