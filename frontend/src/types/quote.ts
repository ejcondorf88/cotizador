export type QuoteStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export const QuoteStatusLabels: Record<QuoteStatus, string> = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export interface Quote {
  id: string;
  folioNumber: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
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
