import { Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { GiroAutocomplete } from '../catalogos/GiroAutocomplete';
import { CONSTRUCTION_TYPE_OPTIONS, PROPERTY_USAGE_OPTIONS } from '../../constants/catalogs';
import type { PropertyFormData } from '../../schemas/property.schema';
import type { UseFormSetValue } from 'react-hook-form';

interface PropertyConstructionSectionProps {
  control: Control<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
}

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Componente presentacional puro.
 * Sin useState, sin useEffect, sin console.logs de debug.
 * GiroAutocomplete actualiza el form directamente vía setValue.
 */
export function PropertyConstructionSection({
  control,
  errors,
  setValue,
}: PropertyConstructionSectionProps) {
  const [constructionType, propertyUsage, specificActivity] = useWatch({
    control,
    name: ['constructionType', 'propertyUsage', 'specificActivity'],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
          <i className="pi pi-building text-[#C9A84C]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Datos de Construcción</h3>
          <p className="text-sm text-gray-400">Especifique las características del inmueble</p>
        </div>
      </div>

      {/* Tipo constructivo y Año */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Tipo constructivo <span className="text-red-400">*</span>
          </label>
          <Controller
            name="constructionType"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                options={CONSTRUCTION_TYPE_OPTIONS}
                optionLabel="label"
                optionValue="value"
                onChange={(e) => field.onChange(e.value)}
                placeholder="Seleccione"
                className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
                panelClassName="bg-[#1A1A2E] border border-gray-600"
              />
            )}
          />
          {errors.constructionType && (
            <p className="text-red-500 text-xs">{errors.constructionType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Año de construcción
          </label>
          <Controller
            name="constructionYear"
            control={control}
            render={({ field }) => (
              <InputText
                value={field.value?.toString() || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  field.onChange(val ? parseInt(val) : undefined);
                }}
                placeholder={`1900-${CURRENT_YEAR}`}
                maxLength={4}
                keyfilter="num"
                className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
              />
            )}
          />
          {errors.constructionYear && (
            <p className="text-red-500 text-xs">{errors.constructionYear.message}</p>
          )}
        </div>
      </div>

      {/* Niveles y Uso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Número de niveles</label>
          <Controller
            name="levels"
            control={control}
            render={({ field }) => (
              <InputNumber
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                min={1}
                max={50}
                placeholder="1"
                className="w-full"
                inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
              />
            )}
          />
          {errors.levels && <p className="text-red-500 text-xs">{errors.levels.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Uso del inmueble <span className="text-red-400">*</span>
          </label>
          <Controller
            name="propertyUsage"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                options={PROPERTY_USAGE_OPTIONS}
                optionLabel="label"
                optionValue="value"
                onChange={(e) => field.onChange(e.value)}
                placeholder="Seleccione"
                className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
                panelClassName="bg-[#1A1A2E] border border-gray-600"
              />
            )}
          />
          {errors.propertyUsage && (
            <p className="text-red-500 text-xs">{errors.propertyUsage.message}</p>
          )}
        </div>
      </div>

      {/* Giro específico — autocomplete actualiza el form via setValue */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Giro específico <span className="text-red-400">*</span>
        </label>
        <Controller
          name="specificActivity"
          control={control}
          render={({ field }) => (
            <GiroAutocomplete
              value={field.value}
              onChange={(giro) => {
                setValue('specificActivity', giro.description, { shouldValidate: true });
                setValue('activityCode', giro.code);
              }}
              error={errors.specificActivity?.message}
              placeholder="Ej. Restaurante, Tienda de ropa, Oficinas..."
            />
          )}
        />
      </div>

      {/* Clave de giro (read-only, se llena automáticamente) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Clave de giro</label>
        <Controller
          name="activityCode"
          control={control}
          render={({ field }) => (
            <>
              <InputText
                {...field}
                value={field.value || ''}
                placeholder="Se asigna automáticamente o puede ingresar manualmente"
                className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
              />
              {field.value && (
                <p className="text-xs text-green-400">
                  <i className="pi pi-check-circle mr-1" />
                  Clave asignada: {field.value}
                </p>
              )}
            </>
          )}
        />
      </div>

      {/* Validation summary — reactivo vía useWatch */}
      <div className="bg-[#252540] rounded-lg p-4 border border-[#C9A84C]/20">
        <h4 className="text-sm font-medium text-[#C9A84C] mb-2">Campos requeridos:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Tipo constructivo', ok: !!constructionType },
            { label: 'Uso del inmueble', ok: !!propertyUsage },
            { label: 'Giro específico', ok: !!specificActivity },
          ].map(({ label, ok }) => (
            <div key={label} className={`flex items-center gap-2 ${ok ? 'text-green-400' : 'text-gray-500'}`}>
              <i className={`pi ${ok ? 'pi-check-circle' : 'pi-circle'}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
