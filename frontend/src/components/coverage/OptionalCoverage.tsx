import type { Coverage, CoverageCode } from '../../types/coverage';
import { CoverageToggle } from './CoverageToggle';

interface OptionalCoverageProps {
  coverages: Coverage[];
  selectedIds: CoverageCode[];
  onToggle: (coverageId: CoverageCode) => void;
}

export function OptionalCoverage({
  coverages,
  selectedIds,
  onToggle,
}: OptionalCoverageProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Section Header */}
      <div className="mb-4 pb-2 border-b-2 border-amber-500">
        <h2 className="text-lg font-bold text-gray-900">
          Coberturas Opcionales
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Selecciona las coberturas adicionales que deseas incluir
        </p>
      </div>

      {/* Coverage List */}
      <div className="space-y-3">
        {coverages.map((coverage) => (
          <CoverageToggle
            key={coverage.id}
            coverage={coverage}
            isActive={selectedIds.includes(coverage.id)}
            isLocked={false}
            onToggle={() => onToggle(coverage.id)}
          />
        ))}
      </div>

      {coverages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay coberturas opcionales disponibles</p>
        </div>
      )}
    </div>
  );
}
