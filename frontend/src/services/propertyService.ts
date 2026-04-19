import type {
  Property,
  BulkCreatePropertiesRequest,
  BulkCreatePropertiesResponse,
  GetPropertiesByQuoteResponse,
  UpdatePropertyRequest,
  ActivityOption,
} from '../types/property';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const propertyService = {
  async createPropertiesBulk(
    quoteId: string,
    request: BulkCreatePropertiesRequest,
  ): Promise<BulkCreatePropertiesResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/quotes/${quoteId}/properties/bulk`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error creating properties');
    }

    return response.json();
  },

  async getPropertiesByQuote(quoteId: string): Promise<GetPropertiesByQuoteResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/quotes/${quoteId}/properties`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error fetching properties');
    }

    return response.json();
  },

  async updateProperty(
    propertyId: string,
    request: UpdatePropertyRequest,
  ): Promise<Property> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/properties/${propertyId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error updating property');
    }

    return response.json();
  },

  async deletePropertiesByQuote(quoteId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/quotes/${quoteId}/properties`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Error deleting properties');
    }
  },

  async validateZipCode(cp: string): Promise<{ valid: boolean; message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/cp/${cp}/validate`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error validating zip code');
    }

    return response.json();
  },

  async searchActivities(query: string): Promise<ActivityOption[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/activities/search?query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Error searching activities');
    }

    return response.json();
  },
};
