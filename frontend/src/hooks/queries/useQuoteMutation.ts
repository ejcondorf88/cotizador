import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../../services/quoteService';
import type { Quote } from '../../types/quote';

export const QUOTES_KEY = 'quotes';

export function useQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<Quote, Error>({
    mutationFn: quoteService.createQuote,
    retry: 3,
    onSuccess: (data) => {
      // Invalidate cache if needed
      queryClient.invalidateQueries({ queryKey: [QUOTES_KEY] });

      // Or set directly
      queryClient.setQueryData([QUOTES_KEY, data.id], data);
    },
    onError: (error) => {
      console.error('Error creating quote:', error);
    },
  });
}
