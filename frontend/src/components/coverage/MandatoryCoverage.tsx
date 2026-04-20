import type { Coverage } from '../../types/coverage';
import { CoverageToggle } from './CoverageToggle';

interface MandatoryCoverageProps {
  coverages: Coverage[];
}

export function MandatoryCoverage({ coverages }: MandatoryCoverageProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Section Header */}
      <div className="mb-4 pb-2 border-b-2 border-amber-500">
        <h2 className="text-lg font-bold text-gray-900">
          Coberturas Obligatorias
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Estas coberturas son requeridas y no pueden desactivarse
        </p>
      </div>

      {/* Coverage List */}
      <div className="space-y-3">
        {coverages.map((coverage) => (
          <CoverageToggle
            key={coverage.id}
            coverage={coverage}
            isActive={true}
            isLocked={true}
          />
        ))}
      </div>

      {coverages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay coberturas obligatorias disponibles</p>
        </div>
      )}
    </div>
  );
}
