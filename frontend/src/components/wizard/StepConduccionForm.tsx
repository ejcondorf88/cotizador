import { Controller, type Control, type FieldErrors, type UseFormSetValue } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { AgenteAutocomplete } from '../catalogos/AgenteAutocomplete';
import { SuscriptorAutocomplete } from '../catalogos/SuscriptorAutocomplete';
import { OficinaDropdown } from '../catalogos/OficinaDropdown';
import type { WizardFormData } from '../../schemas/wizard.schema';

interface StepConduccionFormProps {
  control: Control<WizardFormData>;
  errors: FieldErrors<WizardFormData>;
  setValue: UseFormSetValue<WizardFormData>;
}

/**
 * Componente presentacional puro.
 * Sin useState locales (selectedAgente, selectedSuscriptor, selectedOficina eliminados).
 * Los autocompletes actualizan el form directamente vía setValue.
 */
export function StepConduccionForm({ control, errors, setValue }: StepConduccionFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white font-heading mb-2">🧑‍💼 Conducción</h2>
        <p className="text-gray-400">
          Selecciona el agente, suscriptor y oficina para la cotización
        </p>
      </div>

      {/* Agente */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Agente <span className="text-red-500">*</span>
        </label>
        <Controller
          name="agentKey"
          control={control}
          render={({ field }) => (
            <AgenteAutocomplete
              value={field.value}
              onChange={(agente) => {
                setValue('agentKey', agente.codigo, { shouldValidate: true });
                setValue('agentName', agente.nombre);
                setValue('agentId', agente.agenteId);
                if (agente.oficinaId) {
                  setValue('officeId', agente.oficinaId);
                }
              }}
              error={errors.agentKey?.message}
              placeholder="Ej: AGT-001234 o nombre del agente"
            />
          )}
        />
      </div>

      {/* Nombre del agente (solo lectura) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Nombre del agente</label>
        <Controller
          name="agentName"
          control={control}
          render={({ field }) => (
            <InputText
              value={field.value || ''}
              disabled
              className="w-full bg-[#1A1A2E] border border-gray-700 text-gray-400 cursor-not-allowed"
            />
          )}
        />
        <p className="text-gray-500 text-xs">Se completa automáticamente al seleccionar el agente</p>
      </div>

      {/* Suscriptor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Suscriptor <span className="text-red-500">*</span>
        </label>
        <Controller
          name="subscriber"
          control={control}
          render={({ field }) => (
            <SuscriptorAutocomplete
              value={field.value || ''}
              onChange={(suscriptor) => {
                setValue('subscriberId', suscriptor.suscriptorId);
                setValue('subscriber', suscriptor.nombre);
              }}
              error={errors.subscriber?.message}
              placeholder="Ej: SUB-001 o nombre del suscriptor"
            />
          )}
        />
      </div>

      {/* Oficina */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Oficina <span className="text-red-500">*</span>
        </label>
        <Controller
          name="officeId"
          control={control}
          render={({ field }) => (
            <OficinaDropdown
              value={field.value || ''}
              onChange={(oficina) => {
                setValue('officeId', oficina.oficinaId);
                setValue('office', oficina.nombre);
              }}
              error={errors.office?.message}
              placeholder="Seleccione una oficina..."
            />
          )}
        />
      </div>

      {/* Info box */}
      <div className="bg-[#252540] border border-[#C9A84C]/20 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <i className="pi pi-info-circle text-[#C9A84C] mt-0.5" />
          <div>
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">¿No encuentras algún dato?</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contacta al administrador para registrar nuevos agentes, suscriptores o oficinas en el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
