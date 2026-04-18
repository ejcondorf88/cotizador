import axios from 'axios';
import type { Quote } from '../types/quote';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const quoteService = {
  async createQuote(): Promise<Quote> {
    try {
      const response = await axios.post<Quote>(
        `${API_URL}/api/v1/quotes`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Unable to connect to server. Please verify the backend is running.');
        }
        if (error.response?.status === 500) {
          throw new Error('Internal server error');
        }
        throw new Error(error.response?.data?.message || 'Error creating quote');
      }
      throw error;
    }
  },
};
