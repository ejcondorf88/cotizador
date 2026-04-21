import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormGetValues,
} from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { catalogs } from '../../services/quoteService';
import type { WizardFormData } from '../../schemas/wizard.schema';
import type { PaymentType } from '../../types/quote';

interface StepVigenciaFormProps {
  control: Control<WizardFormData>;
  errors: FieldErrors<WizardFormData>;
  setValue: UseFormSetValue<WizardFormData>;
  getValues: UseFormGetValues<WizardFormData>;
  summary: {
    companyName: string;
    rfc: string;
    businessLine: string;
    agentKey: string;
    agentName: string;
  };
}

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '-';
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getPaymentLabel = (type: PaymentType): string => {
  const option = catalogs.paymentTypes.find((p) => p.value === type);
  return option?.label || type;
};

/**
 * Componente presentacional puro.
 * Sin lógica de estado local. La lógica de "reset endDate" se ejecuta
 * directamente en el onChange del Controller usando setValue.
 */
export function StepVigenciaForm({
  control,
  errors,
  setValue,
  getValues,
  summary,
}: StepVigenciaFormProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white font-heading mb-2">📅 Vigencia</h2>
        <p className="text-gray-400">Define el período de vigencia y condiciones de pago</p>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Fecha de inicio <span className="text-red-500">*</span>
          </label>
          <Controller
            name="validityStart"
            control={control}
            render={({ field }) => (
              <Calendar
                value={field.value}
                onChange={(e) => {
                  const newStart = e.value as Date | null;
                  field.onChange(newStart);
                  // Reset validityEnd si es anterior o igual al nuevo inicio
                  const currentEnd = getValues('validityEnd');
                  if (newStart && currentEnd && currentEnd <= newStart) {
                    setValue('validityEnd', null as unknown as Date);
                  }
                }}
                minDate={today}
                locale="es"
                dateFormat="dd/mm/yy"
                placeholder="Selecciona fecha"
                className={`w-full ${errors.validityStart ? 'p-invalid' : ''}`}
                panelClassName="bg-[#252540]"
                pt={{
                  root: { className: 'w-full' },
                  input: {
                    className: `w-full bg-[#1A1A2E] border-2 ${
                      errors.validityStart ? 'border-red-500' : 'border-gray-600'
                    } text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] rounded-lg py-3 px-4`,
                  },
                }}
              />
            )}
          />
          {errors.validityStart && (
            <p className="text-red-500 text-xs">{errors.validityStart.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Fecha de fin <span className="text-red-500">*</span>
          </label>
          <Controller
            name="validityEnd"
            control={control}
            render={({ field }) => {
              const startDate = getValues('validityStart');
              const minEnd = startDate
                ? new Date(startDate.getTime() + 86400000)
                : today;

              return (
                <Calendar
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  minDate={minEnd}
                  locale="es"
                  dateFormat="dd/mm/yy"
                  placeholder="Selecciona fecha"
                  disabled={!startDate}
                  className={`w-full ${errors.validityEnd ? 'p-invalid' : ''}`}
                  panelClassName="bg-[#252540]"
                  pt={{
                    root: { className: 'w-full' },
                    input: {
                      className: `w-full bg-[#1A1A2E] border-2 ${
                        errors.validityEnd ? 'border-red-500' : 'border-gray-600'
                      } text-white placeholder-gray-400 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] rounded-lg py-3 px-4 ${
                        !startDate ? 'cursor-not-allowed opacity-60' : ''
                      }`,
                    },
                  }}
                />
              );
            }}
          />
          {errors.validityEnd && (
            <p className="text-red-500 text-xs">{errors.validityEnd.message}</p>
          )}
          {!getValues('validityStart') && (
            <p className="text-gray-500 text-xs">Primero selecciona la fecha de inicio</p>
          )}
        </div>
      </div>

      {/* Moneda y Tipo de pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Moneda <span className="text-red-500">*</span>
          </label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                options={catalogs.currencies}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Selecciona moneda"
                className="w-full"
                panelClassName="bg-[#252540] border-gray-600"
                pt={{
                  root: { className: 'bg-[#1A1A2E] border-2 border-gray-600 text-white rounded-lg hover:border-[#C9A84C] transition-colors' },
                  input: { className: 'text-white py-3 px-4' },
                }}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Tipo de pago <span className="text-red-500">*</span>
          </label>
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                options={catalogs.paymentTypes}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Selecciona tipo"
                className="w-full"
                panelClassName="bg-[#252540] border-gray-600"
                pt={{
                  root: { className: 'bg-[#1A1A2E] border-2 border-gray-600 text-white rounded-lg hover:border-[#C9A84C] transition-colors' },
                  input: { className: 'text-white py-3 px-4' },
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Resumen */}
      <Card className="bg-[#252540] border border-[#C9A84C]/30 mt-8">
        <div className="p-4">
          <h3 className="text-lg font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
            <i className="pi pi-file" />
            Resumen de Cotización
          </h3>
          <div className="space-y-4">
            <div className="border-b border-gray-600 pb-3">
              <h4 className="text-sm font-semibold text-[#C9A84C] mb-2">🏢 Asegurado</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-300 font-medium">Empresa:</span>
                  <span className="text-white ml-2">{summary.companyName || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-300 font-medium">RFC:</span>
                  <span className="text-white ml-2">{summary.rfc || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-300 font-medium">Giro:</span>
                  <span className="text-white ml-2">{summary.businessLine || '-'}</span>
                </div>
              </div>
            </div>
            <div className="border-b border-gray-600 pb-3">
              <h4 className="text-sm font-semibold text-[#C9A84C] mb-2">🧑‍💼 Conducción</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-300 font-medium">Agente:</span>
                  <span className="text-white ml-2">{summary.agentName || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Clave:</span>
                  <span className="text-white ml-2 font-mono text-[#C9A84C]">{summary.agentKey || '-'}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#C9A84C] mb-2">📅 Vigencia</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="col-span-2">
                  <span className="text-gray-300 font-medium">Período:</span>
                  <span className="text-white ml-2">
                    {getValues('validityStart') && getValues('validityEnd')
                      ? `${formatDate(getValues('validityStart'))} - ${formatDate(getValues('validityEnd'))}`
                      : 'Por definir'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Moneda:</span>
                  <span className="text-white ml-2">
                    {getValues('currency') === 'MXN' ? '💲 MXN' : '💵 USD'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300 font-medium">Pago:</span>
                  <span className="text-white ml-2">{getPaymentLabel(getValues('paymentType'))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
