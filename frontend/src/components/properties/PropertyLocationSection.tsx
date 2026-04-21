import { Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { STATES_MX } from '../../constants/mexico';
import type { PropertyFormData } from '../../schemas/property.schema';

interface PropertyLocationSectionProps {
  control: Control<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
}

const stateOptions = STATES_MX.map((s) => ({ label: s, value: s }));

/**
 * Componente presentacional puro.
 * Sin useState, sin useEffect, sin llamadas onChange genéricas.
 * El "validation summary" usa useWatch para leer los valores reactivamente.
 */
export function PropertyLocationSection({ control, errors }: PropertyLocationSectionProps) {
  // Lectura reactiva para el validation summary — sin estado local
  const [name, street, zipCode, state, city, neighborhood] = useWatch({
    control,
    name: ['name', 'street', 'zipCode', 'state', 'city', 'neighborhood'],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
          <i className="pi pi-map-marker text-[#C9A84C]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Ubicación del Inmueble</h3>
          <p className="text-sm text-gray-400">Complete la dirección completa</p>
        </div>
      </div>

      {/* Nombre del inmueble */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Nombre del inmueble <span className="text-red-400">*</span>
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="Ej. Oficinas Corporativas"
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
            />
          )}
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      {/* Calle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Calle y número <span className="text-red-400">*</span>
        </label>
        <Controller
          name="street"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="Ej. Av. Reforma 100"
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
            />
          )}
        />
        {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}
      </div>

      {/* Código Postal */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Código Postal <span className="text-red-400">*</span>
        </label>
        <Controller
          name="zipCode"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="00000"
              maxLength={5}
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
            />
          )}
        />
        {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
      </div>

      {/* Estado y Ciudad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Estado <span className="text-red-400">*</span>
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                options={stateOptions}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Seleccione"
                filter
                className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
                panelClassName="bg-[#1A1A2E] border border-gray-600"
              />
            )}
          />
          {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Ciudad <span className="text-red-400">*</span>
          </label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                placeholder="Ej. Ciudad de México"
                className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
              />
            )}
          />
          {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
        </div>
      </div>

      {/* Colonia */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Colonia <span className="text-red-400">*</span>
        </label>
        <Controller
          name="neighborhood"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="Ej. Juárez"
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
            />
          )}
        />
        {errors.neighborhood && (
          <p className="text-red-500 text-xs">{errors.neighborhood.message}</p>
        )}
      </div>

      {/* Validation summary — reactivo vía useWatch, sin estado local */}
      <div className="bg-[#252540] rounded-lg p-4 border border-[#C9A84C]/20">
        <h4 className="text-sm font-medium text-[#C9A84C] mb-2">Campos requeridos:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Nombre', ok: !!name },
            { label: 'Calle', ok: !!street },
            { label: 'CP', ok: zipCode?.length === 5 },
            { label: 'Estado', ok: !!state },
            { label: 'Ciudad', ok: !!city },
            { label: 'Colonia', ok: !!neighborhood },
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
