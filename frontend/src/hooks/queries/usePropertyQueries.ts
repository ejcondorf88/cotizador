import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../../services/propertyService';
import type {
  Property,
  BulkCreatePropertiesRequest,
  UpdatePropertyRequest,
} from '../../types/property';

export const PROPERTIES_KEY = 'properties';

// Query hook to fetch properties by quote
export function usePropertiesByQuoteQuery(quoteId: string | null) {
  return useQuery<{ properties: Property[]; total: number; completed: number }, Error>({
    queryKey: [PROPERTIES_KEY, quoteId],
    queryFn: () => {
      if (!quoteId) throw new Error('Quote ID is required');
      return propertyService.getPropertiesByQuote(quoteId);
    },
    enabled: !!quoteId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Mutation hook to create properties in bulk
export function useCreatePropertiesBulkMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { properties: Property[] },
    Error,
    { quoteId: string; data: BulkCreatePropertiesRequest }
  >({
    mutationFn: ({ quoteId, data }) =>
      propertyService.createPropertiesBulk(quoteId, data),
    onSuccess: (_, { quoteId }) => {
      // Invalidate and refetch properties
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY, quoteId] });
    },
  });
}

// Mutation hook to update a property
export function useUpdatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    Property,
    Error,
    { propertyId: string; quoteId: string; data: UpdatePropertyRequest }
  >({
    mutationFn: ({ propertyId, data }) =>
      propertyService.updateProperty(propertyId, data),
    onSuccess: (_, { quoteId }) => {
      // Invalidate properties for this quote
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY, quoteId] });
    },
  });
}

// Mutation hook to delete all properties by quote
export function useDeletePropertiesMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { quoteId: string }>({
    mutationFn: ({ quoteId }) =>
      propertyService.deletePropertiesByQuote(quoteId),
    onSuccess: (_, { quoteId }) => {
      // Invalidate and refetch properties
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY, quoteId] });
    },
  });
}

// Hook to invalidate properties
export function useInvalidateProperties() {
  const queryClient = useQueryClient();

  return {
    invalidateProperties: (quoteId: string) => {
      queryClient.invalidateQueries({ queryKey: [PROPERTIES_KEY, quoteId] });
    },
    setPropertiesData: (
      quoteId: string,
      data: { properties: Property[]; total: number; completed: number }
    ) => {
      queryClient.setQueryData([PROPERTIES_KEY, quoteId], data);
    },
  };
}
