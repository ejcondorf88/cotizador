import { v4 as uuid } from 'uuid';
import { ConstructionType } from '../enums/construction-type.enum';
import { PropertyUsage } from '../enums/property-usage.enum';

export interface PropertyAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export class Property {
  constructor(
    public readonly id: string,
    public readonly quoteId: string,
    public name: string,
    public address: PropertyAddress,
    public insuredValue: number,
    public constructionType: ConstructionType | null,
    public usage: PropertyUsage | null,
    public completionPercentage: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    quoteId: string,
    name: string,
    address: PropertyAddress,
    insuredValue: number,
    constructionType: ConstructionType | null = null,
    usage: PropertyUsage | null = null,
  ): Property {
    const now = new Date();
    return new Property(
      uuid(),
      quoteId,
      name,
      address,
      insuredValue,
      constructionType,
      usage,
      0,
      now,
      now,
    );
  }

  static createEmpty(quoteId: string, index: number): Property {
    return Property.create(
      quoteId,
      `Inmueble ${index}`,
      {
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
      0,
    );
  }

  update(data: Partial<{
    name: string;
    address: Partial<PropertyAddress>;
    insuredValue: number;
    constructionType: ConstructionType;
    usage: PropertyUsage;
  }>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.address) {
      if (data.address.street !== undefined) this.address.street = data.address.street;
      if (data.address.neighborhood !== undefined) this.address.neighborhood = data.address.neighborhood;
      if (data.address.city !== undefined) this.address.city = data.address.city;
      if (data.address.state !== undefined) this.address.state = data.address.state;
      if (data.address.zipCode !== undefined) this.address.zipCode = data.address.zipCode;
    }
    if (data.insuredValue !== undefined) this.insuredValue = data.insuredValue;
    if (data.constructionType !== undefined) this.constructionType = data.constructionType;
    if (data.usage !== undefined) this.usage = data.usage;

    this.updatedAt = new Date();
    this.recalculateCompletionPercentage();
  }

  recalculateCompletionPercentage(): void {
    const requiredFields = [
      this.name?.trim().length > 0,
      this.address?.street?.trim().length > 0,
      this.address?.neighborhood?.trim().length > 0,
      this.address?.city?.trim().length > 0,
      this.address?.state?.trim().length > 0,
      /^\d{5}$/.test(this.address?.zipCode || ''),
      this.insuredValue > 0,
      this.constructionType !== null,
      this.usage !== null,
    ];

    const completedFields = requiredFields.filter(Boolean).length;
    this.completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
  }

  isComplete(): boolean {
    return this.completionPercentage >= 80;
  }
}
