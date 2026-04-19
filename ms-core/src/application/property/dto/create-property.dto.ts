import { IsString, IsNumber, IsOptional, IsEnum, Min, Max, MaxLength, Matches } from 'class-validator';
import { ConstructionType } from '../../../domain/property/enums/construction-type.enum';
import { PropertyUsage } from '../../../domain/property/enums/property-usage.enum';

export class CreatePropertyDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(200)
  street: string;

  @IsString()
  @MaxLength(100)
  neighborhood: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(50)
  state: string;

  @IsString()
  @MaxLength(5)
  @Matches(/^\d{5}$/, { message: 'Zip code must be exactly 5 digits' })
  zipCode: string;

  @IsNumber()
  @Min(0)
  @Max(100000000, { message: 'Maximum insured value is $100,000,000 MXN' })
  insuredValue: number;

  @IsOptional()
  @IsEnum(ConstructionType)
  constructionType?: ConstructionType;

  @IsOptional()
  @IsEnum(PropertyUsage)
  usage?: PropertyUsage;
}
