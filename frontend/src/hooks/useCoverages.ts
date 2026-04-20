import { useState, useEffect, useCallback } from 'react';
import { coverageService } from '../services/coverageService';
import type {
  Coverage,
  CoverageCode,
  CoverageResponse,
  UpdateCoveragesResponse,
} from '../types/coverage';
import { CoverageType } from '../types/coverage';

interface UseCoveragesReturn {
  coverages: Coverage[];
  mandatory: Coverage[];
  optional: Coverage[];
  selected: Coverage[];
  selectedIds: CoverageCode[];
  loading: boolean;
  error: string | null;
  basePremium: number;
  totalPremium: number;
  toggle: (coverageId: CoverageCode) => void;
  isSelected: (coverageId: CoverageCode) => boolean;
  saveCoverages: () => Promise<UpdateCoveragesResponse | null>;
  refresh: () => Promise<void>;
}

export function useCoverages(quoteId: string | undefined): UseCoveragesReturn {
  const [coverages, setCoverages] = useState<Coverage[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<CoverageCode>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [premiums, setPremiums] = useState({ basePremium: 0, totalPremium: 0 });

  const fetchCoverages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data: CoverageResponse = await coverageService.getCoverages();

      // Combine mandatory and optional
      const allCoverages = [...data.mandatory, ...data.optional];

      // Set initial selected state - mandatory always selected, optional not selected
      const initialSelected = new Set<CoverageCode>();
      data.mandatory.forEach((c) => initialSelected.add(c.id));

      setCoverages(allCoverages);
      setSelectedIds(initialSelected);
      setPremiums({ basePremium: 0, totalPremium: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading coverages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoverages();
  }, [fetchCoverages]);

  const toggle = useCallback((coverageId: CoverageCode) => {
    const coverage = coverages.find((c) => c.id === coverageId);
    if (!coverage || coverage.type === CoverageType.MANDATORY) {
      // Cannot toggle mandatory coverages
      return;
    }

    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(coverageId)) {
        newSet.delete(coverageId);
      } else {
        newSet.add(coverageId);
      }
      return newSet;
    });
  }, [coverages]);

  const isSelected = useCallback(
    (coverageId: CoverageCode) => {
      return selectedIds.has(coverageId);
    },
    [selectedIds],
  );

  const saveCoverages = useCallback(async (): Promise<UpdateCoveragesResponse | null> => {
    if (!quoteId) {
      setError('No quote ID provided');
      return null;
    }

    try {
      const coverageIdsArray = Array.from(selectedIds);
      const response = await coverageService.updateCoverages(quoteId, {
        coverageIds: coverageIdsArray,
      });
      setPremiums({
        basePremium: response.basePremium,
        totalPremium: response.totalPremium,
      });
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving coverages');
      return null;
    }
  }, [quoteId, selectedIds]);

  // Derive arrays from state
  const mandatory = coverages.filter((c) => c.type === CoverageType.MANDATORY);
  const optional = coverages.filter((c) => c.type === CoverageType.OPTIONAL);
  const selected = coverages.filter((c) => selectedIds.has(c.id));

  return {
    coverages,
    mandatory,
    optional,
    selected,
    selectedIds: Array.from(selectedIds),
    loading,
    error,
    basePremium: premiums.basePremium,
    totalPremium: premiums.totalPremium,
    toggle,
    isSelected,
    saveCoverages,
    refresh: fetchCoverages,
  };
}
