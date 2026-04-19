import { IsNumber, IsUUID, Min, Max } from 'class-validator';

export class BulkCreatePropertiesDto {
  @IsUUID()
  quoteId: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  count: number;
}
