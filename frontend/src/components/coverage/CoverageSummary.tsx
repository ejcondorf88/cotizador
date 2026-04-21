// CoverageSummary component - no imports needed from coverage types

interface CoverageSummaryProps {
  mandatoryCount: number;
  optionalSelected: number;
  totalCount: number;
  basePremium: number;
  currency?: 'MXN' | 'USD';
}

export function CoverageSummary({
  mandatoryCount,
  optionalSelected,
  totalCount,
  basePremium = 0,
  currency = 'MXN',
}: CoverageSummaryProps) {
  const currencySymbol = currency === 'USD' ? '$' : '$';
  const formattedPremium = (basePremium ?? 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Section Header */}
      <div className="mb-4 pb-2 border-b-2 border-amber-500">
        <h2 className="text-lg font-bold text-gray-900">
          Resumen de Coberturas
        </h2>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Mandatory Count */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <span className="text-lg">🔒</span>
            <span className="text-sm font-medium">Obligatorias</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {mandatoryCount}
          </p>
        </div>

        {/* Optional Selected */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <span className="text-lg">✓</span>
            <span className="text-sm font-medium">Opcionales activas</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {optionalSelected}
          </p>
        </div>

        {/* Total Count */}
        <div className="bg-[#1A1A2E] rounded-lg p-4 border border-[#C9A84C]/30">
          <div className="flex items-center gap-2 text-[#C9A84C] mb-1">
            <span className="text-lg">📋</span>
            <span className="text-sm font-medium">Total seleccionadas</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {totalCount}
          </p>
        </div>
      </div>

      {/* Premium Info */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#252540] rounded-lg p-4 border border-[#C9A84C]/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm text-gray-400">Prima estimada base</p>
            <p className="text-xs text-gray-500">
              El cálculo final se realizará al completar la cotización
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#C9A84C]">
              {currencySymbol}{formattedPremium}
            </p>
            <p className="text-sm text-gray-400">{currency}</p>
          </div>
        </div>
      </div>

      {/* Alert for no optional */}
      {optionalSelected === 0 && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <span className="text-amber-600 text-lg">⚠️</span>
          <p className="text-sm text-amber-800">
            Solo se incluirán las coberturas obligatorias. Puedes continuar con esta configuración.
          </p>
        </div>
      )}
    </div>
  );
}
