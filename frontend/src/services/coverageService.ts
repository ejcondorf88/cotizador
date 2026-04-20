import axios from 'axios';
import type {
  CoverageResponse,
  UpdateCoveragesRequest,
  UpdateCoveragesResponse,
} from '../types/coverage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const coverageService = {
  async getCoverages(): Promise<CoverageResponse> {
    try {
      const response = await axios.get<CoverageResponse>(`${API_URL}/coverages`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error fetching coverages');
      }
      throw error;
    }
  },

  async updateCoverages(
    quoteId: string,
    request: UpdateCoveragesRequest,
  ): Promise<UpdateCoveragesResponse> {
    try {
      const response = await axios.patch<UpdateCoveragesResponse>(
        `${API_URL}/quotes/${quoteId}/coverages`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error updating coverages');
      }
      throw error;
    }
  },
};
