import { PropertyStepper } from './PropertyStepper';
import type { Property, PropertyStatus, UpdatePropertyRequest } from '../../types/property';
import { PropertyStatusLabels, ConstructionTypeLabels, PropertyUsageLabels } from '../../types/property';

interface PropertyCardProps {
  property: Property;
  propertyIndex: number;
  isExpanded: boolean;
  isSaving: boolean;
  onToggle: () => void;
  onSave: (data: UpdatePropertyRequest) => void;
  autoSave?: boolean;
}

export function PropertyCard({
  property,
  propertyIndex,
  isExpanded,
  isSaving,
  onToggle,
  onSave,
  autoSave = true,
}: PropertyCardProps) {
  const isComplete = property.status === 'COMPLETE';
  const totalSumInsured = property.totalSumInsured || 
    Object.values(property.coverages || {}).reduce((sum, val) => sum + (val || 0), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get coverage summary (non-zero values only)
  const getCoverageSummary = () => {
    const coverageLabels: Record<string, string> = {
      building: 'Edificio',
      contents: 'Contenidos',
      electronicEquipment: 'Equipo',
      machinery: 'Maquinaria',
      stock: 'Existencias',
    };

    return Object.entries(property.coverages || {})
      .filter(([, value]) => (value || 0) > 0)
      .map(([key]) => coverageLabels[key] || key)
      .slice(0, 3); // Show max 3
  };

  const coverageSummary = getCoverageSummary();

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all duration-300 ${
        isExpanded
          ? 'border-[#C9A84C] shadow-lg shadow-[#C9A84C]/10'
          : isComplete
            ? 'border-green-500/30 bg-green-600/10'
            : 'border-gray-700 bg-[#252540]'
      }`}
    >
      {/* Card Header */}
      <button
        className={`w-full text-left p-4 flex items-center justify-between transition-all duration-300 ${
          isExpanded
            ? 'bg-[#C9A84C] text-white'
            : isComplete
              ? 'bg-green-600/20 border-green-500/30 text-green-400'
              : 'bg-[#1A1A2E] hover:bg-[#252540] text-gray-300'
        } ${isComplete && !isExpanded ? 'border border-green-500/30' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isComplete
                ? 'bg-green-500 text-white'
                : property.completionPercentage > 0
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-700 text-gray-400'
            }`}
          >
            {isComplete ? (
              <i className="pi pi-check text-sm"></i>
            ) : property.completionPercentage > 0 ? (
              <i className="pi pi-pencil text-sm"></i>
            ) : (
              <span className="text-sm font-bold">{propertyIndex}</span>
            )}
          </div>

          {/* Property Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base">
                {isComplete || property.name?.trim()
                  ? property.name
                  : `Inmueble ${propertyIndex}`}
              </h3>
              {!isExpanded && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isComplete
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {PropertyStatusLabels[property.status as PropertyStatus]}
                </span>
              )}
            </div>

            {/* Summary line when collapsed */}
            {!isExpanded && (
              <div className="mt-1 space-y-0.5">
                {property.address?.street && (
                  <p className="text-xs text-gray-500">
                    {property.address.street}, {property.address.neighborhood}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs">
                  {property.construction?.type && (
                    <span className="text-gray-400">
                      {ConstructionTypeLabels[property.construction.type]}
                    </span>
                  )}
                  {property.construction?.usage && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">
                        {PropertyUsageLabels[property.construction.usage]}
                      </span>
                    </>
                  )}
                  {totalSumInsured > 0 && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-[#C9A84C]">
                        {formatCurrency(totalSumInsured)}
                      </span>
                    </>
                  )}
                </div>
                {!isComplete && coverageSummary.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Garantías: {coverageSummary.join(', ')}
                    {coverageSummary.length < Object.values(property.coverages || {}).filter(v => v > 0).length && '...'}
                  </p>
                )}
              </div>
            )}

            {/* Completion percentage */}
            {!isComplete && !isExpanded && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${property.completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-yellow-400">
                    {property.completionPercentage}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Status badge and arrow */}
        <div className="flex items-center gap-2">
          {!isComplete && !isExpanded && (
            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
              Incompleto
            </span>
          )}
          <i
            className={`pi ${
              isExpanded ? 'pi-chevron-down' : 'pi-chevron-right'
            } text-lg`}
          ></i>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="bg-[#1A1A2E] border-t border-gray-700">
          <PropertyStepper
            property={property}
            onSave={onSave}
            isSaving={isSaving}
            autoSave={autoSave}
          />
        </div>
      )}
    </div>
  );
}
