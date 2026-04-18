import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote } from '../../types/quote';

interface QuoteState {
  // UI state
  showDetails: boolean;
  selectedQuote: Quote | null;

  // Actions
  setShowDetails: (show: boolean) => void;
  selectQuote: (quote: Quote | null) => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      showDetails: false,
      selectedQuote: null,
      setShowDetails: (show) => set({ showDetails: show }),
      selectQuote: (quote) => set({ selectedQuote: quote }),
    }),
    {
      name: 'quote-storage',
    }
  )
);
