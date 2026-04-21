import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../../services/quoteService';
import type { Quote, QuoteStatus, UpdateQuoteRequest } from '../../types/quote';

interface UpdateQuoteParams {
  id: string;
  data: UpdateQuoteRequest;
}

/**
 * Mutación para actualizar una cotización existente.
 */
export function useUpdateQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<Quote, Error, UpdateQuoteParams>({
    mutationFn: ({ id, data }) => quoteService.updateQuote(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.setQueryData(['quotes', variables.id], data);
    },
    onError: (error) => {
      console.error('Error updating quote:', error);
    },
  });
}

/**
 * Mutación para completar el wizard (cambia estado de DRAFT a IN_PROGRESS).
 */
export function useCompleteQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<Quote, Error, { id: string; data: UpdateQuoteRequest }>({
    mutationFn: ({ id, data }) =>
      quoteService.updateQuote(id, { ...data, status: 'IN_PROGRESS' as QuoteStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: (error) => {
      console.error('Error completing quote:', error);
    },
  });
}
