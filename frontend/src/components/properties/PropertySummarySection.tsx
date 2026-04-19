import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Badge } from 'primereact/badge';
import type { Property, PropertyAddress, ConstructionDetails, PropertyCoverages } from '../../types/property';
import { PropertyStatus, PropertyStatusLabels, ConstructionTypeLabels, PropertyUsageLabels } from '../../types/property';

interface PropertySummarySectionProps {
  property: Property;
  onSave: () => void;
  isSaving: boolean;
}

interface ValidationItem {
  label: string;
  valid: boolean;
  icon: string;
}

export function PropertySummarySection({
  property,
  onSave,
  isSaving,
}: PropertySummarySectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getValidationItems = (): ValidationItem[] => {
    return [
      { label: 'Nombre del inmueble', valid: property.name?.trim().length > 0, icon: 'pi pi-tag' },
      { label: 'Calle y número', valid: property.address?.street?.trim().length > 0, icon: 'pi pi-map' },
      { label: 'Código postal', valid: /^\d{5}$/.test(property.address?.zipCode || ''), icon: 'pi pi-envelope' },
      { label: 'Estado', valid: property.address?.state?.trim().length > 0, icon: 'pi pi-map-marker' },
      { label: 'Ciudad', valid: property.address?.city?.trim().length > 0, icon: 'pi pi-home' },
      { label: 'Colonia', valid: property.address?.neighborhood?.trim().length > 0, icon: 'pi pi-building' },
      { label: 'Tipo constructivo', valid: !!property.construction?.type, icon: 'pi pi-wrench' },
      { label: 'Uso del inmueble', valid: !!property.construction?.usage, icon: 'pi pi-briefcase' },
      { label: 'Giro específico', valid: property.construction?.specificActivity?.trim().length > 0, icon: 'pi pi-shopping-bag' },
      { label: 'Al menos una garantía', valid: property.coverages && Object.values(property.coverages).some(v => (v || 0) > 0), icon: 'pi pi-shield' },
    ];
  };

  const validationItems = getValidationItems();
  const completedCount = validationItems.filter(item => item.valid).length;
  const isComplete = property.status === PropertyStatus.COMPLETE;
  const totalSumInsured = property.totalSumInsured || 
    Object.values(property.coverages || {}).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isComplete ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
          <i className={`pi ${isComplete ? 'pi-check-circle text-green-500' : 'pi-exclamation-circle text-yellow-500'}`}></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Resumen de la Ficha</h3>
          <p className="text-sm text-gray-400">Revise la información antes de guardar</p>
        </div>
      </div>

      {/* Status Card */}
      <div className={`rounded-lg p-4 border ${isComplete ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className={`pi ${isComplete ? 'pi-check-circle text-green-500' : 'pi-exclamation-circle text-yellow-500'} text-2xl`}></i>
            <div>
              <h4 className={`font-semibold ${isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                {PropertyStatusLabels[property.status]}
              </h4>
              <p className="text-sm text-gray-400">
                {completedCount} de {validationItems.length} campos completados
              </p>
            </div>
          </div>
          <Badge
            value={property.completionPercentage + '%'}
            severity={isComplete ? 'success' : 'warning'}
            className="text-lg"
          />
        </div>
        <ProgressBar
          value={property.completionPercentage}
          className="h-2 mt-3 bg-gray-700"
          pt={{
            value: {
              className: isComplete ? 'bg-green-500' : 'bg-yellow-500',
            },
          }}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Summary */}
        <div className="bg-[#252540] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <i className="pi pi-map-marker text-[#C9A84C]"></i>
            <h5 className="font-medium text-white">Ubicación</h5>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-white font-medium">{property.name || 'Sin nombre'}</p>
            <p className="text-gray-400">{property.address?.street || 'Sin dirección'}</p>
            <p className="text-gray-400">
              {property.address?.neighborhood}, {property.address?.zipCode}
            </p>
            <p className="text-gray-400">
              {property.address?.city}, {property.address?.state}
            </p>
          </div>
        </div>

        {/* Construction Summary */}
        <div className="bg-[#252540] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <i className="pi pi-building text-[#C9A84C]"></i>
            <h5 className="font-medium text-white">Construcción</h5>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">
              <span className="text-white">Tipo:</span>{' '}
              {property.construction?.type ? ConstructionTypeLabels[property.construction.type] : 'No especificado'}
            </p>
            {property.construction?.year && (
              <p className="text-gray-400">
                <span className="text-white">Año:</span> {property.construction.year}
              </p>
            )}
            {property.construction?.levels && (
              <p className="text-gray-400">
                <span className="text-white">Niveles:</span> {property.construction.levels}
              </p>
            )}
            <p className="text-gray-400">
              <span className="text-white">Uso:</span>{' '}
              {property.construction?.usage ? PropertyUsageLabels[property.construction.usage] : 'No especificado'}
            </p>
            <p className="text-gray-400">
              <span className="text-white">Giro:</span>{' '}
              {property.construction?.specificActivity || 'No especificado'}
            </p>
            {property.construction?.activityCode && (
              <p className="text-gray-400">
                <span className="text-white">Clave:</span> {property.construction.activityCode}
              </p>
            )}
          </div>
        </div>

        {/* Coverages Summary */}
        <div className="bg-[#252540] rounded-lg p-4 border border-gray-700 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <i className="pi pi-shield text-[#C9A84C]"></i>
            <h5 className="font-medium text-white">Garantías</h5>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { key: 'building', label: 'Edificio', icon: 'pi pi-building' },
              { key: 'contents', label: 'Contenidos', icon: 'pi pi-box' },
              { key: 'electronicEquipment', label: 'Equipo Electrónico', icon: 'pi pi-desktop' },
              { key: 'machinery', label: 'Maquinaria', icon: 'pi pi-cog' },
              { key: 'stock', label: 'Existencias', icon: 'pi pi-tags' },
            ].map(({ key, label, icon }) => {
              const value = (property.coverages?.[key as keyof PropertyCoverages] || 0);
              const hasValue = value > 0;
              return (
                <div
                  key={key}
                  className={`rounded-lg p-3 text-center ${hasValue ? 'bg-[#C9A84C]/10 border border-[#C9A84C]/30' : 'bg-gray-800/50'}`}
                >
                  <i className={`${icon} ${hasValue ? 'text-[#C9A84C]' : 'text-gray-600'}`}></i>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                  <p className={`text-sm font-medium ${hasValue ? 'text-white' : 'text-gray-600'}`}>
                    {hasValue ? formatCurrency(value) : '$0'}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
            <span className="text-gray-400">Total Suma Asegurada:</span>
            <span className="text-xl font-bold text-[#C9A84C]">{formatCurrency(totalSumInsured)}</span>
          </div>
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="bg-[#252540] rounded-lg p-4 border border-gray-700">
        <h5 className="font-medium text-white mb-3">Validación de campos</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {validationItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 text-sm ${item.valid ? 'text-green-400' : 'text-gray-500'}`}
            >
              <i className={`pi ${item.valid ? 'pi-check-circle' : 'pi-circle'} ${item.valid ? 'text-green-500' : 'text-gray-600'}`}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-700">
        <Button
          label={isSaving ? 'Guardando...' : 'Guardar Ficha'}
          icon={isSaving ? 'pi pi-spin pi-spinner' : 'pi pi-save'}
          onClick={onSave}
          loading={isSaving}
          disabled={isSaving}
          className={`px-8 py-3 ${
            isComplete
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              : 'bg-gradient-to-r from-[#C9A84C] to-[#B8983E] hover:from-[#B8983E] hover:to-[#C9A84C]'
          } text-white border-none`}
        />
      </div>

      {!isComplete && (
        <p className="text-sm text-yellow-400 text-right">
          <i className="pi pi-exclamation-circle mr-1"></i>
          La ficha estará incompleta hasta que complete todos los campos requeridos
        </p>
      )}
    </div>
  );
}
