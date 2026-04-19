import { useState, useCallback, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { propertyService } from '../../services/propertyService';
import type { PropertyAddress } from '../../types/property';

interface PropertyLocationSectionProps {
  address: PropertyAddress;
  propertyName: string;
  onChange: (data: { name: string; address: PropertyAddress }) => void;
  errors?: Record<string, string>;
}

const statesMX = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
];

export function PropertyLocationSection({
  address,
  propertyName,
  onChange,
  errors = {},
}: PropertyLocationSectionProps) {
  const [localData, setLocalData] = useState({
    name: propertyName,
    address,
  });
  const [cpValidation, setCpValidation] = useState<{
    valid: boolean;
    message: string;
    loading: boolean;
  }>({ valid: true, message: '', loading: false });

  // Sync with parent
  useEffect(() => {
    setLocalData({ name: propertyName, address });
  }, [propertyName, address]);

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      const newData = { ...localData };
      
      if (field === 'name') {
        newData.name = value;
      } else {
        newData.address = { ...newData.address, [field]: value };
      }
      
      setLocalData(newData);
      onChange(newData);
    },
    [localData, onChange]
  );

  const validateZipCode = useCallback(
    async (cp: string) => {
      if (!/^\d{5}$/.test(cp)) {
        setCpValidation({ valid: false, message: 'El CP debe tener 5 dígitos', loading: false });
        return;
      }

      setCpValidation((prev) => ({ ...prev, loading: true }));

      try {
        const result = await propertyService.validateZipCode(cp);
        setCpValidation({
          valid: result.valid,
          message: result.message,
          loading: false,
        });
      } catch {
        setCpValidation({
          valid: false,
          message: 'Error validando CP',
          loading: false,
        });
      }
    },
    []
  );

  const handleZipCodeChange = useCallback(
    (value: string) => {
      const cleaned = value.replace(/\D/g, '').slice(0, 5);
      handleFieldChange('zipCode', cleaned);

      if (cleaned.length === 5) {
        validateZipCode(cleaned);
      }
    },
    [handleFieldChange, validateZipCode]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
          <i className="pi pi-map-marker text-[#C9A84C]"></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Ubicación del Inmueble</h3>
          <p className="text-sm text-gray-400">Complete la dirección completa</p>
        </div>
      </div>

      {/* Property Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Nombre del inmueble <span className="text-red-400">*</span>
        </label>
        <InputText
          value={localData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="Ej. Oficinas Corporativas"
          className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
        />
        {errors.name && <Message severity="error" text={errors.name} className="text-xs" />}
      </div>

      {/* Street */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Calle y número <span className="text-red-400">*</span>
        </label>
        <InputText
          value={localData.address.street}
          onChange={(e) => handleFieldChange('street', e.target.value)}
          placeholder="Ej. Av. Reforma 100"
          className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
        />
        {errors.street && <Message severity="error" text={errors.street} className="text-xs" />}
      </div>

      {/* ZIP Code */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Código Postal <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <InputText
            value={localData.address.zipCode}
            onChange={(e) => handleZipCodeChange(e.target.value)}
            placeholder="00000"
            maxLength={5}
            className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
          />
          {cpValidation.loading && (
            <i className="pi pi-spin pi-spinner absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A84C]"></i>
          )}
          {!cpValidation.loading && localData.address.zipCode.length === 5 && (
            <i
              className={`pi ${cpValidation.valid ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'} absolute right-3 top-1/2 -translate-y-1/2`}
            ></i>
          )}
        </div>
        {cpValidation.message && !cpValidation.loading && (
          <Message
            severity={cpValidation.valid ? 'success' : 'error'}
            text={cpValidation.message}
            className="text-xs"
          />
        )}
        {errors.zipCode && <Message severity="error" text={errors.zipCode} className="text-xs" />}
      </div>

      {/* State and City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Estado <span className="text-red-400">*</span>
          </label>
          <Dropdown
            value={localData.address.state}
            options={statesMX}
            onChange={(e) => handleFieldChange('state', e.value)}
            placeholder="Seleccione"
            className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
            panelClassName="bg-[#1A1A2E] border border-gray-600"
          />
          {errors.state && <Message severity="error" text={errors.state} className="text-xs" />}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Ciudad <span className="text-red-400">*</span>
          </label>
          <InputText
            value={localData.address.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            placeholder="Ej. Ciudad de México"
            className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
          />
          {errors.city && <Message severity="error" text={errors.city} className="text-xs" />}
        </div>
      </div>

      {/* Neighborhood */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Colonia <span className="text-red-400">*</span>
        </label>
        <InputText
          value={localData.address.neighborhood}
          onChange={(e) => handleFieldChange('neighborhood', e.target.value)}
          placeholder="Ej. Juárez"
          className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
        />
        {errors.neighborhood && <Message severity="error" text={errors.neighborhood} className="text-xs" />}
      </div>

      {/* Validation Summary */}
      <div className="bg-[#252540] rounded-lg p-4 border border-[#C9A84C]/20">
        <h4 className="text-sm font-medium text-[#C9A84C] mb-2">Campos requeridos:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`flex items-center gap-2 ${localData.name ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.name ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>Nombre</span>
          </div>
          <div className={`flex items-center gap-2 ${localData.address.street ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.address.street ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>Calle</span>
          </div>
          <div className={`flex items-center gap-2 ${localData.address.zipCode?.length === 5 ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.address.zipCode?.length === 5 ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>CP</span>
          </div>
          <div className={`flex items-center gap-2 ${localData.address.state ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.address.state ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>Estado</span>
          </div>
          <div className={`flex items-center gap-2 ${localData.address.city ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.address.city ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>Ciudad</span>
          </div>
          <div className={`flex items-center gap-2 ${localData.address.neighborhood ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.address.neighborhood ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>Colonia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
