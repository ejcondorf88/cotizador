import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFeature } from './useFeature';
import * as featureService from '../../services/featureService';

// Mock del servicio
vi.mock('../../services/featureService');

describe('useFeature', () => {
  const mockToken = 'mock-token-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads items on mount', async () => {
    // GIVEN — servicio mock con datos
    const mockData = [
      { id: '1', name: 'Feature 1' },
      { id: '2', name: 'Feature 2' },
    ];
    featureService.getFeatures.mockResolvedValue(mockData);

    // WHEN — render hook
    const { result } = renderHook(() => useFeature(mockToken));

    // THEN — esperar a que cargue
    await waitFor(() => {
      expect(result.current.items).toHaveLength(2);
    });

    expect(result.current.items[0].name).toBe('Feature 1');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles error gracefully', async () => {
    // GIVEN — servicio que falla
    featureService.getFeatures.mockRejectedValue(new Error('Network error'));

    // WHEN — render hook
    const { result } = renderHook(() => useFeature(mockToken));

    // THEN — esperar estado de error
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.error.message).toBe('Network error');
    expect(result.current.items).toEqual([]);
  });

  it('shows loading state initially', () => {
    // GIVEN — servicio que no resuelve inmediatamente
    featureService.getFeatures.mockImplementation(() => new Promise(() => {}));

    // WHEN — render hook
    const { result } = renderHook(() => useFeature(mockToken));

    // THEN — estado de loading
    expect(result.current.loading).toBe(true);
    expect(result.current.items).toEqual([]);
  });

  it('creates feature successfully', async () => {
    // GIVEN — servicios mock
    const newFeature = { id: '3', name: 'New Feature' };
    featureService.getFeatures.mockResolvedValue([]);
    featureService.createFeature.mockResolvedValue(newFeature);

    // WHEN — usar hook y crear
    const { result } = renderHook(() => useFeature(mockToken));
    await result.current.create({ name: 'New Feature' });

    // THEN — feature creado y lista actualizada
    await waitFor(() => {
      expect(result.current.items).toContainEqual(newFeature);
    });
  });
});
