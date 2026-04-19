import { useState, useCallback, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import type {
  Property,
  PropertyAddress,
  ConstructionType,
  PropertyUsage,
  UpdatePropertyRequest,
} from '../../types/property';
import {
  ConstructionTypeLabels,
  PropertyUsageLabels,
} from '../../types/property';

interface PropertyFormProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => void;
  isSaving: boolean;
  autoSave?: boolean;
}

const constructionTypes = Object.values(ConstructionType).map((value) => ({
  label: ConstructionTypeLabels[value],
  value,
}));

const propertyUsages = Object.values(PropertyUsage).map((value) => ({
  label: PropertyUsageLabels[value],
  value,
}));

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

export function PropertyForm({
  property,
  onSave,
  isSaving,
  autoSave = true,
}: PropertyFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    address: PropertyAddress;
    insuredValue: number | null;
    constructionType: ConstructionType | null;
    usage: PropertyUsage | null;
  }>({
    name: property.name,
    address: property.address,
    insuredValue: property.insuredValue || null,
    constructionType: property.constructionType,
    usage: property.usage,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

  // Auto-save with debounce
  useEffect(() => {
    if (!autoSave || dirtyFields.size === 0) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData, dirtyFields, autoSave]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre del inmueble es obligatorio';
    }

    if (!formData.address.street?.trim()) {
      newErrors.street = 'La calle y número son obligatorios';
    }

    if (!formData.address.neighborhood?.trim()) {
      newErrors.neighborhood = 'La colonia es obligatoria';
    }

    if (!formData.address.city?.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }

    if (!formData.address.state?.trim()) {
      newErrors.state = 'El estado es obligatorio';
    }

    if (!/^\d{5}$/.test(formData.address.zipCode || '')) {
      newErrors.zipCode = 'El código postal debe tener 5 dígitos';
    }

    if (!formData.insuredValue || formData.insuredValue <= 0) {
      newErrors.insuredValue = 'El valor asegurable debe ser mayor a 0';
    }

    if (formData.insuredValue && formData.insuredValue > 100000000) {
      newErrors.insuredValue = 'El valor máximo es $100,000,000 MXN';
    }

    if (!formData.constructionType) {
      newErrors.constructionType = 'Seleccione el tipo de construcción';
    }

    if (!formData.usage) {
      newErrors.usage = 'Seleccione el uso del inmueble';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(() => {
    if (!validate()) return;

    const updateData: UpdatePropertyRequest = {
      name: formData.name,
      address: formData.address,
      insuredValue: formData.insuredValue || 0,
      constructionType: formData.constructionType || undefined,
      usage: formData.usage || undefined,
    };

    onSave(updateData);
    setDirtyFields(new Set());
  }, [formData, onSave, validate]);

  const handleFieldChange = useCallback(
    (field: string, value: unknown) => {
      setDirtyFields((prev) => new Set(prev).add(field));

      if (field.startsWith('address.')) {
        const addressField = field.replace('address.', '');
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  return (
    <div className="space-y-6">
      {/* Property Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Nombre del inmueble <span className="text-red-400">*</span>
        </label>
        <InputText
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="Ej. Oficinas Corporativas"
          className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
        />
        {errors.name && <Message severity="error" text={errors.name} className="text-xs" />}
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[#C9A84C]">Dirección</h4>

        <div className="space-y-2">
          <label className="block text-sm text-gray-400">
            Calle y número <span className="text-red-400">*</span>
          </label>
          <InputText
            value={formData.address.street}
            onChange={(e) => handleFieldChange('address.street', e.target.value)}
            placeholder="Ej. Av. Reforma 100"
            className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
          />
          {errors.street && (
            <Message severity="error" text={errors.street} className="text-xs" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">
              Colonia <span className="text-red-400">*</span>
            </label>
            <InputText
              value={formData.address.neighborhood}
              onChange={(e) => handleFieldChange('address.neighborhood', e.target.value)}
              placeholder="Ej. Juárez"
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
            />
            {errors.neighborhood && (
              <Message severity="error" text={errors.neighborhood} className="text-xs" />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">
              Ciudad <span className="text-red-400">*</span>
            </label>
            <InputText
              value={formData.address.city}
              onChange={(e) => handleFieldChange('address.city', e.target.value)}
              placeholder="Ej. Ciudad de México"
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
            />
            {errors.city && (
              <Message severity="error" text={errors.city} className="text-xs" />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">
              Estado <span className="text-red-400">*</span>
            </label>
            <Dropdown
              value={formData.address.state}
              options={statesMX}
              onChange={(e) => handleFieldChange('address.state', e.value)}
              placeholder="Seleccione"
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
              panelClassName="bg-[#1A1A2E] border border-gray-600"
            />
            {errors.state && (
              <Message severity="error" text={errors.state} className="text-xs" />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">
              Código Postal <span className="text-red-400">*</span>
            </label>
            <InputText
              value={formData.address.zipCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                handleFieldChange('address.zipCode', value);
              }}
              placeholder="00000"
              maxLength={5}
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
            />
            {errors.zipCode && (
              <Message severity="error" text={errors.zipCode} className="text-xs" />
            )}
          </div>
        </div>
      </div>

      {/* Insurance Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-[#C9A84C]">Detalles del Seguro</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-gray-400">
              Valor asegurable <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <InputNumber
                value={formData.insuredValue}
                onChange={(e) => handleFieldChange('insuredValue', e.value)}
                mode="currency"
                currency="MXN"
                locale="es-MX"
                placeholder="0.00"
                className="w-full"
                inputClassName="w-full pl-8 bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
              />
            </div>
            {errors.insuredValue && (
              <Message severity="error" text={errors.insuredValue} className="text-xs" />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">
              Tipo de construcción <span className="text-red-400">*</span>
            </label>
            <Dropdown
              value={formData.constructionType}
              options={constructionTypes}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => handleFieldChange('constructionType', e.value)}
              placeholder="Seleccione"
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
              panelClassName="bg-[#1A1A2E] border border-gray-600"
            />
            {errors.constructionType && (
              <Message severity="error" text={errors.constructionType} className="text-xs" />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-400">
              Uso del inmueble <span className="text-red-400">*</span>
            </label>
            <Dropdown
              value={formData.usage}
              options={propertyUsages}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => handleFieldChange('usage', e.value)}
              placeholder="Seleccione"
              className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
              panelClassName="bg-[#1A1A2E] border border-gray-600"
            />
            {errors.usage && (
              <Message severity="error" text={errors.usage} className="text-xs" />
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          label={isSaving ? 'Guardando...' : 'Guardar'}
          icon={isSaving ? 'pi pi-spin pi-spinner' : 'pi pi-save'}
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving || dirtyFields.size === 0}
          className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none px-6"
        />
      </div>

      {autoSave && dirtyFields.size > 0 && (
        <p className="text-xs text-gray-500 text-right">
          Se guardará automáticamente en 3 segundos...
        </p>
      )}
    </div>
  );
}
