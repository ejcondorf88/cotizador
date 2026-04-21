import { Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import type { PropertyFormData } from '../../schemas/property.schema';

interface PropertyCoverageSectionProps {
  control: Control<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
}

interface CoverageConfig {
  name: keyof Pick<
    PropertyFormData,
    | 'coverageBuilding'
    | 'coverageContents'
    | 'coverageElectronic'
    | 'coverageMachinery'
    | 'coverageStock'
  >;
  label: string;
  icon: string;
  color: string;
  max: number;
}

const COVERAGE_CONFIGS: CoverageConfig[] = [
  { name: 'coverageBuilding',   label: 'Edificio',            icon: 'pi pi-building', color: '#C9A84C', max: 100_000_000 },
  { name: 'coverageContents',   label: 'Contenidos',          icon: 'pi pi-box',      color: '#4CAF50', max: 50_000_000 },
  { name: 'coverageElectronic', label: 'Equipo Electrónico',  icon: 'pi pi-desktop',  color: '#2196F3', max: 20_000_000 },
  { name: 'coverageMachinery',  label: 'Maquinaria',          icon: 'pi pi-cog',      color: '#FF9800', max: 30_000_000 },
  { name: 'coverageStock',      label: 'Existencias',         icon: 'pi pi-tags',     color: '#9C27B0', max: 20_000_000 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

/**
 * Componente presentacional puro.
 * Sin useState, sin useEffect, sin onChange genérico.
 * Usa useWatch para calcular totales reactivamente.
 */
export function PropertyCoverageSection({ control, errors }: PropertyCoverageSectionProps) {
  const values = useWatch({
    control,
    name: [
      'coverageBuilding',
      'coverageContents',
      'coverageElectronic',
      'coverageMachinery',
      'coverageStock',
    ],
  });

  const [building, contents, electronic, machinery, stock] = values;
  const total = (building ?? 0) + (contents ?? 0) + (electronic ?? 0) + (machinery ?? 0) + (stock ?? 0);
  const hasAtLeastOne = total > 0;

  const valueMap: Record<CoverageConfig['name'], number> = {
    coverageBuilding:   building   ?? 0,
    coverageContents:   contents   ?? 0,
    coverageElectronic: electronic ?? 0,
    coverageMachinery:  machinery  ?? 0,
    coverageStock:      stock      ?? 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
          <i className="pi pi-shield text-[#C9A84C]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Garantías Asegurables</h3>
          <p className="text-sm text-gray-400">Especifique los valores a asegurar</p>
        </div>
      </div>

      {/* Alerta si no hay cobertura */}
      {!hasAtLeastOne && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <i className="pi pi-exclamation-triangle" />
            <span className="font-medium">
              Debe especificar al menos una garantía con valor mayor a $0
            </span>
          </div>
        </div>
      )}

      {/* Error global del schema (refine) */}
      {errors.coverageBuilding && !errors.coverageBuilding.type && (
        <p className="text-red-500 text-xs">{errors.coverageBuilding.message}</p>
      )}

      {/* Inputs de cobertura */}
      <div className="space-y-4">
        {COVERAGE_CONFIGS.map((config) => (
          <div
            key={config.name}
            className="bg-[#252540] rounded-lg p-4 border border-gray-700 hover:border-[#C9A84C]/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <i className={`${config.icon} text-xl`} style={{ color: config.color }} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">{config.label}</label>
                  <span className="text-xs text-gray-500">Máx: {formatCurrency(config.max)}</span>
                </div>
                <Controller
                  name={config.name}
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputNumber
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(e.value ?? 0)}
                        min={0}
                        max={config.max}
                        placeholder="0"
                        className="w-full"
                        inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
                        mode="currency"
                        currency="MXN"
                        locale="es-MX"
                      />
                      {(field.value ?? 0) > 0 && (
                        <p className="text-xs text-green-400 mt-1">
                          {formatCurrency(field.value ?? 0)}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Quick values */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                {[1_000_000, 5_000_000, 10_000_000].map((amount) => (
                  <Controller
                    key={amount}
                    name={config.name}
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(amount)}
                        disabled={amount > config.max}
                        className="text-xs px-2 py-1 bg-[#1A1A2E] border border-gray-600 text-gray-400 hover:border-[#C9A84C] hover:text-[#C9A84C] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +{formatCurrency(amount)}
                      </button>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de suma asegurada */}
      <div className="bg-gradient-to-r from-[#252540] to-[#1A1A2E] rounded-lg p-6 border border-[#C9A84C]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-calculator text-2xl text-[#C9A84C]" />
            <div>
              <h4 className="text-lg font-semibold text-white">Suma Asegurada Total</h4>
              <p className="text-sm text-gray-400">Valor total de las garantías</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-[#C9A84C]">{formatCurrency(total)}</span>
            <p className="text-xs text-gray-500">MXN</p>
          </div>
        </div>

        {/* Barra de distribución */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Distribución de garantías</span>
            <span>{hasAtLeastOne ? '✓ Al menos una garantía' : '⚠ Se requiere al menos una'}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
            {total > 0 &&
              COVERAGE_CONFIGS.map((config) => {
                const value = valueMap[config.name];
                const pct = (value / total) * 100;
                if (pct === 0) return null;
                return (
                  <div
                    key={config.name}
                    style={{ width: `${pct}%`, backgroundColor: config.color }}
                    className="h-full transition-all duration-300"
                    title={`${config.label}: ${formatCurrency(value)} (${pct.toFixed(1)}%)`}
                  />
                );
              })}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {COVERAGE_CONFIGS.filter((c) => valueMap[c.name] > 0).map((config) => (
              <div key={config.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                <span className="text-gray-400">{config.label}</span>
              </div>
            ))}
          </div>
        </div>

        {total > 100_000_000 && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <i className="pi pi-exclamation-circle" />
              <span className="text-sm">
                La suma asegurada supera $100,000,000 MXN. Requiere aprobación especial.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
