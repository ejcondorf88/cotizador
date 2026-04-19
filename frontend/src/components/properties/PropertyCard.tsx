import { PropertyForm } from './PropertyForm';
import type { Property, UpdatePropertyRequest } from '../../types/property';

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
  const isComplete = property.completionPercentage >= 80;

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
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isComplete ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}
          >
            {isComplete ? (
              <i className="pi pi-check text-sm"></i>
            ) : (
              <span className="text-sm font-bold">{propertyIndex}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium">
              {isComplete ? property.name : `Inmueble ${propertyIndex}`}
            </h3>
            {!isComplete && !isExpanded && (
              <p className="text-xs text-gray-500">
                {property.completionPercentage}% completado
              </p>
            )}
            {isComplete && !isExpanded && <p className="text-xs text-green-400">Completado</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isComplete && !isExpanded && (
            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
              Pendiente
            </span>
          )}
          <i className={`pi ${isExpanded ? 'pi-chevron-down' : 'pi-chevron-right'} text-lg`}></i>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6 bg-[#1A1A2E] border-t border-gray-700 animate-fadeIn">
          <PropertyForm property={property} onSave={onSave} isSaving={isSaving} autoSave={autoSave} />
        </div>
      )}
    </div>
  );
}
