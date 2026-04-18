import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../../services/quoteService';
import type { Quote, QuoteStatus, UpdateQuoteRequest, PaymentType } from '../../types/quote';

interface UpdateQuoteParams {
  id: string;
  data: UpdateQuoteRequest;
}

export function useUpdateQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<Quote, Error, UpdateQuoteParams>({
    mutationFn: ({ id, data }) => quoteService.updateQuote(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific quote
      queryClient.invalidateQueries({ queryKey: ['quotes', variables.id] });
      // Invalidate quotes list (especially DRAFT list)
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      // Optimistically update cache
      queryClient.setQueryData(['quotes', variables.id], data);
    },
    onError: (error) => {
      console.error('Error updating quote:', error);
    },
  });
}

// Hook for completing a quote (changing status from DRAFT to IN_PROGRESS)
export function useCompleteQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<Quote, Error, { id: string; data: UpdateQuoteRequest }>({
    mutationFn: ({ id, data }) => quoteService.updateQuote(id, { ...data, status: 'IN_PROGRESS' as QuoteStatus }),
    onSuccess: () => {
      // Invalidate all quote queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (error) => {
      console.error('Error completing quote:', error);
    },
  });
}

// Helper hook for managing wizard form data
export interface WizardFormData {
  // Step 1: Asegurado
  companyName: string;
  rfc: string;
  businessLine: string;
  businessType: string;

  // Step 2: Conducción
  agentKey: string;
  agentName: string;
  subscriber: string;
  office: string;

  // Step 3: Vigencia
  validityStart: Date | null;
  validityEnd: Date | null;
  currency: 'MXN' | 'USD';
  paymentType: PaymentType;
}

export const initialWizardFormData: WizardFormData = {
  companyName: '',
  rfc: '',
  businessLine: '',
  businessType: '',
  agentKey: '',
  agentName: '',
  subscriber: '',
  office: '',
  validityStart: null,
  validityEnd: null,
  currency: 'MXN',
  paymentType: 'MENSUAL',
};

export function validateStep1(data: Pick<WizardFormData, 'companyName' | 'rfc' | 'businessLine' | 'businessType'>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.companyName.trim()) {
    errors.companyName = 'El nombre de la empresa es obligatorio';
  } else if (data.companyName.length > 150) {
    errors.companyName = 'El nombre no puede exceder 150 caracteres';
  }

  if (!data.rfc.trim()) {
    errors.rfc = 'El RFC es obligatorio';
  } else {
    const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/i;
    if (!rfcRegex.test(data.rfc.toUpperCase())) {
      errors.rfc = 'El RFC no tiene un formato válido (XXXX######XXX)';
    }
  }

  if (!data.businessLine) {
    errors.businessLine = 'El giro del negocio es obligatorio';
  }

  if (!data.businessType) {
    errors.businessType = 'El tipo de negocio es obligatorio';
  }

  return errors;
}

export function validateStep2(data: Pick<WizardFormData, 'agentKey'>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.agentKey.trim()) {
    errors.agentKey = 'La clave del agente es obligatoria';
  }

  return errors;
}

export function validateStep3(data: Pick<WizardFormData, 'validityStart' | 'validityEnd' | 'currency' | 'paymentType'>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.validityStart) {
    errors.validityStart = 'La fecha de inicio es obligatoria';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(data.validityStart);
    startDate.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      errors.validityStart = 'La fecha de inicio no puede ser anterior a hoy';
    }
  }

  if (!data.validityEnd) {
    errors.validityEnd = 'La fecha de fin es obligatoria';
  } else if (data.validityStart && data.validityEnd) {
    const start = new Date(data.validityStart);
    const end = new Date(data.validityEnd);
    
    if (end <= start) {
      errors.validityEnd = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
  }

  if (!data.currency) {
    errors.currency = 'La moneda es obligatoria';
  }

  if (!data.paymentType) {
    errors.paymentType = 'El tipo de pago es obligatorio';
  }

  return errors;
}

export function prepareQuoteUpdateData(formData: WizardFormData): UpdateQuoteRequest {
  return {
    companyName: formData.companyName,
    rfc: formData.rfc.toUpperCase(),
    businessLine: formData.businessLine,
    businessType: formData.businessType,
    agentKey: formData.agentKey,
    agentName: formData.agentName,
    subscriber: formData.subscriber,
    office: formData.office,
    validityStart: formData.validityStart?.toISOString(),
    validityEnd: formData.validityEnd?.toISOString(),
    currency: formData.currency,
    paymentType: formData.paymentType,
  };
}
