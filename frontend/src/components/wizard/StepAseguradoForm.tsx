import { Controller, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { catalogs } from '../../services/quoteService';
import type { WizardFormData } from '../../schemas/wizard.schema';

interface StepAseguradoFormProps {
  control: Control<WizardFormData>;
  errors: FieldErrors<WizardFormData>;
}

/**
 * Componente presentacional puro.
 * Sin useState, sin useEffect, sin lógica de negocio.
 * Recibe control + errors de RHF y renderiza los campos.
 */
export function StepAseguradoForm({ control, errors }: StepAseguradoFormProps) {
  // businessTypes se deriva reactivamente del valor actual del form
  const businessLine = useWatch({ control, name: 'businessLine' });
  const businessTypes =
    businessLine
      ? (catalogs.businessTypes[businessLine as keyof typeof catalogs.businessTypes] ?? [])
      : [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white font-heading mb-2">🏢 Datos del Asegurado</h2>
        <p className="text-gray-400">Ingresa la información de la empresa a asegurar</p>
      </div>

      {/* Nombre de la empresa */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Nombre de la empresa <span className="text-red-500">*</span>
        </label>
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="Ej: Grupo Constructor del Norte S.A. de C.V."
              maxLength={150}
              className={`w-full bg-[#252540] border ${
                errors.companyName ? 'border-red-500' : 'border-gray-600'
              } text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]`}
            />
          )}
        />
        {errors.companyName && (
          <p className="text-red-500 text-xs">{errors.companyName.message}</p>
        )}
      </div>

      {/* RFC */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          RFC <span className="text-red-500">*</span>
          <span className="text-gray-500 text-xs ml-2">(Formato: ABC010101XXX)</span>
        </label>
        <Controller
          name="rfc"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <InputText
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                placeholder="Ej: ABC010101ABC"
                maxLength={13}
                className={`w-full bg-[#252540] border uppercase ${
                  errors.rfc ? 'border-red-500' : 'border-gray-600'
                } text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]`}
              />
            </div>
          )}
        />
        {errors.rfc && <p className="text-red-500 text-xs">{errors.rfc.message}</p>}
      </div>

      {/* Giro del negocio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Giro del negocio <span className="text-red-500">*</span>
        </label>
        <Controller
          name="businessLine"
          control={control}
          render={({ field }) => (
            <Dropdown
              value={field.value}
              options={catalogs.businessLines}
              onChange={(e) => field.onChange(e.value)}
              optionLabel="name"
              optionValue="id"
              placeholder="Selecciona un giro"
              className={`w-full ${errors.businessLine ? 'p-invalid' : ''}`}
              panelClassName="bg-[#252540] border-gray-600"
              pt={{
                root: { className: 'bg-[#252540] border-gray-600 text-white' },
                input: { className: 'text-white' },
                trigger: { className: 'text-gray-400' },
              }}
            />
          )}
        />
        {errors.businessLine && (
          <p className="text-red-500 text-xs">{errors.businessLine.message}</p>
        )}
      </div>

      {/* Tipo de negocio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Tipo de negocio <span className="text-red-500">*</span>
        </label>
        <Controller
          name="businessType"
          control={control}
          render={({ field }) => (
            <Dropdown
              value={field.value}
              options={businessTypes}
              onChange={(e) => field.onChange(e.value)}
              optionLabel="name"
              optionValue="id"
              placeholder={businessLine ? 'Selecciona un tipo' : 'Primero selecciona un giro'}
              disabled={!businessLine}
              className={`w-full ${errors.businessType ? 'p-invalid' : ''}`}
              panelClassName="bg-[#252540] border-gray-600"
              pt={{
                root: { className: 'bg-[#252540] border-gray-600 text-white' },
                input: { className: 'text-white' },
                trigger: { className: businessLine ? 'text-gray-400' : 'text-gray-600' },
              }}
            />
          )}
        />
        {errors.businessType && (
          <p className="text-red-500 text-xs">{errors.businessType.message}</p>
        )}
        {!businessLine && (
          <p className="text-gray-500 text-xs">Selecciona primero el giro del negocio</p>
        )}
      </div>
    </div>
  );
}
