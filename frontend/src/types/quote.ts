export type QuoteStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export const QuoteStatusLabels: Record<QuoteStatus, string> = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export type PaymentType = 'CONTADO' | 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export const PaymentTypeLabels: Record<PaymentType, string> = {
  CONTADO: 'Contado',
  MENSUAL: 'Mensual',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual',
};

export interface QuoteDetail {
  // Paso 1: Asegurado
  companyName: string;
  rfc: string;
  businessLine: string;
  businessType: string;

  // Paso 2: Conducción
  agentKey: string;
  agentName: string;
  subscriber: string;
  office: string;

  // Paso 3: Vigencia
  validityStart: string;
  validityEnd: string;
  currency: 'MXN' | 'USD';
  paymentType: PaymentType;
}

export interface Quote {
  id: string;
  folioNumber: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  details?: QuoteDetail;
}

export interface CreateQuoteRequest {
  // Empty for now
}

export interface CreateQuoteResponse {
  id: string;
  folioNumber: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateQuoteRequest {
  // Paso 1: Asegurado
  companyName?: string;
  rfc?: string;
  businessLine?: string;
  businessType?: string;

  // Paso 2: Conducción
  agentKey?: string;
  agentName?: string;
  subscriber?: string;
  office?: string;

  // Paso 3: Vigencia
  validityStart?: string;
  validityEnd?: string;
  currency?: 'MXN' | 'USD';
  paymentType?: PaymentType;

  // Cambio de estado
  status?: QuoteStatus;
}

// Catalog types
export interface BusinessLine {
  id: string;
  name: string;
}

export interface BusinessType {
  id: string;
  name: string;
}

export interface Agent {
  key: string;
  name: string;
  subscriber: string;
  office: string;
}

export interface Currency {
  value: 'MXN' | 'USD';
  label: string;
}

export interface PaymentTypeOption {
  value: PaymentType;
  label: string;
}
