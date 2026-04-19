import { useState, useCallback, useEffect, useMemo } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import type { PropertyCoverages } from '../../types/property';

interface PropertyCoverageSectionProps {
  coverages: PropertyCoverages;
  onChange: (data: PropertyCoverages) => void;
  errors?: Record<string, string>;
}

interface CoverageConfig {
  key: keyof PropertyCoverages;
  label: string;
  icon: string;
  color: string;
  max: number;
}

const coverageConfigs: CoverageConfig[] = [
  { key: 'building', label: 'Edificio', icon: 'pi pi-building', color: '#C9A84C', max: 100000000 },
  { key: 'contents', label: 'Contenidos', icon: 'pi pi-box', color: '#4CAF50', max: 50000000 },
  { key: 'electronicEquipment', label: 'Equipo Electrónico', icon: 'pi pi-desktop', color: '#2196F3', max: 20000000 },
  { key: 'machinery', label: 'Maquinaria', icon: 'pi pi-cog', color: '#FF9800', max: 30000000 },
  { key: 'stock', label: 'Existencias', icon: 'pi pi-tags', color: '#9C27B0', max: 20000000 },
];

export function PropertyCoverageSection({
  coverages,
  onChange,
  errors = {},
}: PropertyCoverageSectionProps) {
  const [localData, setLocalData] = useState<PropertyCoverages>(coverages);

  // Sync with parent
  useEffect(() => {
    setLocalData(coverages);
  }, [coverages]);

  const handleFieldChange = useCallback(
    (key: keyof PropertyCoverages, value: number | null) => {
      const newData = { ...localData, [key]: value || 0 };
      setLocalData(newData);
      onChange(newData);
    },
    [localData, onChange]
  );

  const totalSumInsured = useMemo(() => {
    return Object.values(localData).reduce((sum, value) => sum + (value || 0), 0);
  }, [localData]);

  const hasAtLeastOneCoverage = useMemo(() => {
    return Object.values(localData).some((value) => (value || 0) > 0);
  }, [localData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
          <i className="pi pi-shield text-[#C9A84C]"></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Garantías Asegurables</h3>
          <p className="text-sm text-gray-400">Especifique los valores a asegurar</p>
        </div>
      </div>

      {/* Warning if no coverage */}
      {!hasAtLeastOneCoverage && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <i className="pi pi-exclamation-triangle"></i>
            <span className="font-medium">Debe especificar al menos una garantía con valor mayor a $0</span>
          </div>
        </div>
      )}

      {/* Coverage Inputs */}
      <div className="space-y-4">
        {coverageConfigs.map((config) => (
          <div
            key={config.key}
            className="bg-[#252540] rounded-lg p-4 border border-gray-700 hover:border-[#C9A84C]/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <i className={`${config.icon} text-xl`} style={{ color: config.color }}></i>
              </div>

              {/* Label and Input */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    {config.label}
                  </label>
                  <span className="text-xs text-gray-500">
                    Máx: {formatCurrency(config.max)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <InputNumber
                    value={localData[config.key]}
                    onChange={(e) => handleFieldChange(config.key, e.value)}
                    min={0}
                    max={config.max}
                    placeholder="0"
                    className="w-full"
                    inputClassName="w-full pl-8 bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
                    mode="currency"
                    currency="MXN"
                    locale="es-MX"
                  />
                </div>
                {localData[config.key] > 0 && (
                  <p className="text-xs text-green-400 mt-1">
                    {formatCurrency(localData[config.key] || 0)}
                  </p>
                )}
              </div>

              {/* Quick values */}
              <div className="flex flex-col gap-1">
                {[1000000, 5000000, 10000000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleFieldChange(config.key, amount)}
                    disabled={amount > config.max}
                    className="text-xs px-2 py-1 bg-[#1A1A2E] border border-gray-600 text-gray-400 hover:border-[#C9A84C] hover:text-[#C9A84C] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +{formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-r from-[#252540] to-[#1A1A2E] rounded-lg p-6 border border-[#C9A84C]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-calculator text-2xl text-[#C9A84C]"></i>
            <div>
              <h4 className="text-lg font-semibold text-white">Suma Asegurada Total</h4>
              <p className="text-sm text-gray-400">Valor total de las garantías</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-[#C9A84C]">
              {formatCurrency(totalSumInsured)}
            </span>
            <p className="text-xs text-gray-500">MXN</p>
          </div>
        </div>

        {/* Progress bar showing coverage distribution */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Distribución de garantías</span>
            <span>{hasAtLeastOneCoverage ? '✓ Al menos una garantía especificada' : '⚠ Se requiere al menos una garantía'}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
            {totalSumInsured > 0 && coverageConfigs.map((config) => {
              const value = localData[config.key] || 0;
              const percentage = (value / totalSumInsured) * 100;
              if (percentage === 0) return null;
              return (
                <div
                  key={config.key}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.color,
                  }}
                  className="h-full transition-all duration-300"
                  title={`${config.label}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {coverageConfigs
              .filter((config) => (localData[config.key] || 0) > 0)
              .map((config) => (
                <div key={config.key} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-gray-400">{config.label}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Warning if exceeds threshold */}
        {totalSumInsured > 100000000 && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <i className="pi pi-exclamation-circle"></i>
              <span className="text-sm">
                La suma asegurada total supera $100,000,000 MXN. Requiere aprobación especial.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Validation Message */}
      {errors.coverages && (
        <Message severity="error" text={errors.coverages} className="text-sm" />
      )}
    </div>
  );
}
