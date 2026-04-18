import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { catalogs, validateRFC, formatRFC } from '../../services/quoteService';

interface StepAseguradoFormProps {
  data: {
    companyName: string;
    rfc: string;
    businessLine: string;
    businessType: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

interface BusinessTypeOption {
  id: string;
  name: string;
}

export function StepAseguradoForm({ data, onChange, errors }: StepAseguradoFormProps) {
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeOption[]>([]);

  // Update business types when business line changes
  useEffect(() => {
    if (data.businessLine) {
      const types = catalogs.businessTypes[data.businessLine as keyof typeof catalogs.businessTypes] || [];
      setBusinessTypes(types);
      // Reset business type if current one is not valid for new line
      const currentTypeValid = types.some((t) => t.id === data.businessType);
      if (!currentTypeValid && data.businessType) {
        onChange('businessType', '');
      }
    } else {
      setBusinessTypes([]);
    }
  }, [data.businessLine]);

  const handleRFCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRFC(e.target.value);
    onChange('rfc', formatted);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white font-heading mb-2">
          🏢 Datos del Asegurado
        </h2>
        <p className="text-gray-400">
          Ingresa la información de la empresa a asegurar
        </p>
      </div>

      {/* Nombre de la empresa */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Nombre de la empresa <span className="text-red-500">*</span>
        </label>
        <InputText
          value={data.companyName}
          onChange={(e) => onChange('companyName', e.target.value)}
          placeholder="Ej: Grupo Constructor del Norte S.A. de C.V."
          className={`w-full bg-[#252540] border ${
            errors.companyName ? 'border-red-500' : 'border-gray-600'
          } text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]`}
          maxLength={150}
        />
        {errors.companyName && (
          <p className="text-red-500 text-xs">{errors.companyName}</p>
        )}
      </div>

      {/* RFC */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          RFC <span className="text-red-500">*</span>
          <span className="text-gray-500 text-xs ml-2">(Formato: ABC010101XXX)</span>
        </label>
        <div className="relative">
          <InputText
            value={data.rfc}
            onChange={handleRFCChange}
            placeholder="Ej: ABC010101ABC"
            className={`w-full bg-[#252540] border ${
              errors.rfc ? 'border-red-500' : data.rfc && !validateRFC(data.rfc) 
                ? 'border-yellow-500' 
                : 'border-gray-600'
            } text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] uppercase`}
            maxLength={13}
          />
          {data.rfc && validateRFC(data.rfc) && (
            <i className="pi pi-check-circle text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>
        {errors.rfc && (
          <p className="text-red-500 text-xs">{errors.rfc}</p>
        )}
        {data.rfc && !validateRFC(data.rfc) && !errors.rfc && (
          <p className="text-yellow-500 text-xs">El formato no parece válido</p>
        )}
      </div>

      {/* Giro del negocio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Giro del negocio <span className="text-red-500">*</span>
        </label>
        <Dropdown
          value={data.businessLine}
          options={catalogs.businessLines}
          onChange={(e) => onChange('businessLine', e.value)}
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
        {errors.businessLine && (
          <p className="text-red-500 text-xs">{errors.businessLine}</p>
        )}
      </div>

      {/* Tipo de negocio */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Tipo de negocio <span className="text-red-500">*</span>
        </label>
        <Dropdown
          value={data.businessType}
          options={businessTypes}
          onChange={(e) => onChange('businessType', e.value)}
          optionLabel="name"
          optionValue="id"
          placeholder={
            data.businessLine 
              ? "Selecciona un tipo" 
              : "Primero selecciona un giro"
          }
          disabled={!data.businessLine}
          className={`w-full ${errors.businessType ? 'p-invalid' : ''}`}
          panelClassName="bg-[#252540] border-gray-600"
          pt={{
            root: { className: 'bg-[#252540] border-gray-600 text-white' },
            input: { className: 'text-white' },
            trigger: { className: data.businessLine ? 'text-gray-400' : 'text-gray-600' },
          }}
        />
        {errors.businessType && (
          <p className="text-red-500 text-xs">{errors.businessType}</p>
        )}
        {!data.businessLine && (
          <p className="text-gray-500 text-xs">
            Selecciona primero el giro del negocio
          </p>
        )}
      </div>
    </div>
  );
}
