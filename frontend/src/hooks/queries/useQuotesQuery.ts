import { useQuery, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../../services/quoteService';
import type { Quote, QuoteStatus } from '../../types/quote';

export const QUOTES_KEY = 'quotes';

export function useQuotesQuery(status?: QuoteStatus) {
  return useQuery<Quote[], Error>({
    queryKey: status ? [QUOTES_KEY, status] : [QUOTES_KEY],
    queryFn: () => {
      if (status) {
        return quoteService.getQuotesByStatus(status);
      }
      return quoteService.getQuotes();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useQuoteByIdQuery(id: string | null) {
  return useQuery<Quote, Error>({
    queryKey: [QUOTES_KEY, id],
    queryFn: () => {
      if (!id) throw new Error('Quote ID is required');
      return quoteService.getQuoteById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInvalidateQuotes() {
  const queryClient = useQueryClient();

  return {
    invalidateQuotes: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_KEY] });
    },
    invalidateQuote: (id: string) => {
      queryClient.invalidateQueries({ queryKey: [QUOTES_KEY, id] });
    },
    setQuoteData: (id: string, data: Quote) => {
      queryClient.setQueryData([QUOTES_KEY, id], data);
    },
  };
}
