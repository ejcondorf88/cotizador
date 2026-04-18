import { IsOptional, IsString, MaxLength, Matches, IsIn, IsDateString } from 'class-validator';
import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';

export class UpdateQuoteDto {
  // Asegurado
  @IsOptional()
  @IsString()
  @MaxLength(150)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(13)
  @Matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/i, {
    message: 'RFC must be in valid Mexican format (XXXX######XXX)',
  })
  rfc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  businessLine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  businessType?: string;

  // Conducción
  @IsOptional()
  @IsString()
  @MaxLength(20)
  agentKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  agentName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  subscriber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  office?: string;

  // Vigencia
  @IsOptional()
  @IsDateString()
  validityStart?: string;

  @IsOptional()
  @IsDateString()
  validityEnd?: string;

  @IsOptional()
  @IsIn(['MXN', 'USD'])
  currency?: 'MXN' | 'USD';

  @IsOptional()
  @IsIn(['CONTADO', 'MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL'])
  paymentType?: 'CONTADO' | 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

  // Status change
  @IsOptional()
  @IsIn(['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: QuoteStatus;
}
