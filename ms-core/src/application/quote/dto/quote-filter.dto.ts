import { IsOptional, IsIn } from 'class-validator';
import { QuoteStatus } from '../../../domain/quote/enums/quote-status.enum';

export class QuoteFilterDto {
  @IsOptional()
  @IsIn(['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: QuoteStatus;
}
