import { v4 as uuid } from 'uuid';
import { ConstructionType } from '../enums/construction-type.enum';
import { PropertyUsage } from '../enums/property-usage.enum';
import { PropertyStatus } from '../enums/property-status.enum';

export enum PropertyCalculationStatus {
  CALCULATED = 'CALCULATED',
  INCOMPLETE = 'INCOMPLETE',
}

export interface PropertyAddress {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ConstructionDetails {
  type: ConstructionType;
  year?: number;
  levels?: number;
  usage: PropertyUsage;
  specificActivity: string;
  activityCode?: string;
}

export interface PropertyCoverages {
  building: number;
  contents: number;
  electronicEquipment: number;
  machinery: number;
  stock: number;
}

export class Property {
  netPremium?: number;
  commercialPremium?: number;
  incompleteReason?: string;

  constructor(
    public readonly id: string,
    public readonly quoteId: string,
    public name: string,
    public address: PropertyAddress,
    public construction: ConstructionDetails,
    public coverages: PropertyCoverages,
    public status: PropertyStatus,
    public completionPercentage: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    quoteId: string,
    name: string,
    address: PropertyAddress,
    construction: ConstructionDetails,
    coverages: PropertyCoverages,
  ): Property {
    const now = new Date();
    const property = new Property(
      uuid(),
      quoteId,
      name,
      address,
      construction,
      coverages,
      PropertyStatus.INCOMPLETE,
      0,
      now,
      now,
    );
    property.recalculateStatus();
    return property;
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
      {
        type: ConstructionType.CONCRETO,
        usage: PropertyUsage.COMERCIAL,
        specificActivity: '',
      },
      {
        building: 0,
        contents: 0,
        electronicEquipment: 0,
        machinery: 0,
        stock: 0,
      },
    );
  }

  update(data: Partial<{
    name: string;
    address: Partial<PropertyAddress>;
    construction: Partial<ConstructionDetails>;
    coverages: Partial<PropertyCoverages>;
  }>): void {
    if (data.name !== undefined) this.name = data.name;

    if (data.address) {
      if (data.address.street !== undefined) this.address.street = data.address.street;
      if (data.address.neighborhood !== undefined) this.address.neighborhood = data.address.neighborhood;
      if (data.address.city !== undefined) this.address.city = data.address.city;
      if (data.address.state !== undefined) this.address.state = data.address.state;
      if (data.address.zipCode !== undefined) this.address.zipCode = data.address.zipCode;
    }

    if (data.construction) {
      if (data.construction.type !== undefined) this.construction.type = data.construction.type;
      if (data.construction.year !== undefined) this.construction.year = data.construction.year;
      if (data.construction.levels !== undefined) this.construction.levels = data.construction.levels;
      if (data.construction.usage !== undefined) this.construction.usage = data.construction.usage;
      if (data.construction.specificActivity !== undefined) this.construction.specificActivity = data.construction.specificActivity;
      if (data.construction.activityCode !== undefined) this.construction.activityCode = data.construction.activityCode;
    }

    if (data.coverages) {
      if (data.coverages.building !== undefined) this.coverages.building = data.coverages.building;
      if (data.coverages.contents !== undefined) this.coverages.contents = data.coverages.contents;
      if (data.coverages.electronicEquipment !== undefined) this.coverages.electronicEquipment = data.coverages.electronicEquipment;
      if (data.coverages.machinery !== undefined) this.coverages.machinery = data.coverages.machinery;
      if (data.coverages.stock !== undefined) this.coverages.stock = data.coverages.stock;
    }

    this.updatedAt = new Date();
    this.recalculateStatus();
  }

  recalculateStatus(): void {
    const validations = [
      // Ubicación
      this.name?.trim().length > 0,
      this.address?.street?.trim().length > 0,
      /^\d{5}$/.test(this.address?.zipCode || ''),
      this.address?.state?.trim().length > 0,
      this.address?.city?.trim().length > 0,
      this.address?.neighborhood?.trim().length > 0,
      // Construcción
      this.construction?.type !== null && this.construction?.type !== undefined,
      this.construction?.usage !== null && this.construction?.usage !== undefined,
      this.construction?.specificActivity?.trim().length > 0,
      // Garantías - al menos una con valor > 0
      this.getTotalCoverage() > 0,
    ];

    const completedFields = validations.filter(Boolean).length;
    this.completionPercentage = Math.round((completedFields / validations.length) * 100);
    this.status = this.completionPercentage === 100
      ? PropertyStatus.COMPLETE
      : PropertyStatus.INCOMPLETE;
  }

  getTotalCoverage(): number {
    return Object.values(this.coverages).reduce((sum, value) => sum + (value || 0), 0);
  }

  isComplete(): boolean {
    return this.status === PropertyStatus.COMPLETE;
  }
}
