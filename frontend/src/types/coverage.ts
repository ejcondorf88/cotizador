export const CoverageType = {
  MANDATORY: 'MANDATORY',
  OPTIONAL: 'OPTIONAL',
} as const;

export type CoverageType = (typeof CoverageType)[keyof typeof CoverageType];

export const CoverageCode = {
  FIRE: 'FIRE',
  CAT: 'CAT',
  GLASS: 'GLASS',
  WATER: 'WATER',
  THEFT: 'THEFT',
  LIABILITY: 'LIABILITY',
  ELECTRONIC: 'ELECTRONIC',
  EXTRA_EXPENSES: 'EXTRA_EXPENSES',
} as const;

export type CoverageCode = (typeof CoverageCode)[keyof typeof CoverageCode];

export interface Coverage {
  id: CoverageCode;
  name: string;
  description: string;
  type: CoverageType;
  icon: string;
  baseRate: number;
  isSelected?: boolean;
}

export interface CoverageResponse {
  data: {
    mandatory: Coverage[];
    optional: Coverage[];
  };
}

export interface UpdateCoveragesRequest {
  coverageIds: CoverageCode[];
}

export interface UpdateCoveragesResponse {
  quoteId: string;
  selectedCoverages: Coverage[];
  basePremium: number;
  totalPremium: number;
}

export const CoverageCodeLabels: Record<CoverageCode, string> = {
  [CoverageCode.FIRE]: 'Incendio y Rayo',
  [CoverageCode.CAT]: 'CAT (Terremoto/Huracán)',
  [CoverageCode.GLASS]: 'Cristales y Vidrios',
  [CoverageCode.WATER]: 'Daños por Agua',
  [CoverageCode.THEFT]: 'Robo y Hurto',
  [CoverageCode.LIABILITY]: 'Responsabilidad Civil',
  [CoverageCode.ELECTRONIC]: 'Equipo Electrónico',
  [CoverageCode.EXTRA_EXPENSES]: 'Gastos Extraordinarios',
};

export const CoverageIcons: Record<CoverageCode, string> = {
  [CoverageCode.FIRE]: '🔥',
  [CoverageCode.CAT]: '🌪️',
  [CoverageCode.GLASS]: '🪟',
  [CoverageCode.WATER]: '💧',
  [CoverageCode.THEFT]: '🦹',
  [CoverageCode.LIABILITY]: '⚖️',
  [CoverageCode.ELECTRONIC]: '🔌',
  [CoverageCode.EXTRA_EXPENSES]: '💸',
};
