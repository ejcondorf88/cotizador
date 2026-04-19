import { useState, useCallback, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { AutoComplete } from 'primereact/autocomplete';
import { Message } from 'primereact/message';
import { propertyService } from '../../services/propertyService';
import type { ConstructionDetails, ActivityOption } from '../../types/property';
import { ConstructionType, PropertyUsage, ConstructionTypeLabels, PropertyUsageLabels } from '../../types/property';

interface PropertyConstructionSectionProps {
  construction: ConstructionDetails;
  onChange: (data: ConstructionDetails) => void;
  errors?: Record<string, string>;
}

const constructionTypes = Object.values(ConstructionType).map((value) => ({
  label: ConstructionTypeLabels[value],
  value,
}));

const propertyUsages = Object.values(PropertyUsage).map((value) => ({
  label: PropertyUsageLabels[value],
  value,
}));

export function PropertyConstructionSection({
  construction,
  onChange,
  errors = {},
}: PropertyConstructionSectionProps) {
  const [localData, setLocalData] = useState<ConstructionDetails>(construction);
  const [activitySuggestions, setActivitySuggestions] = useState<ActivityOption[]>([]);
  const [isSearchingActivities, setIsSearchingActivities] = useState(false);
  const currentYear = new Date().getFullYear();

  // Sync with parent
  useEffect(() => {
    setLocalData(construction);
  }, [construction]);

  const handleFieldChange = useCallback(
    (field: keyof ConstructionDetails, value: unknown) => {
      const newData = { ...localData, [field]: value };
      setLocalData(newData);
      onChange(newData);
    },
    [localData, onChange]
  );

  const searchActivities = useCallback(
    async (query: string) => {
      if (query.length < 3) {
        setActivitySuggestions([]);
        return;
      }

      setIsSearchingActivities(true);
      try {
        const results = await propertyService.searchActivities(query);
        setActivitySuggestions(results);
      } catch {
        setActivitySuggestions([]);
      } finally {
        setIsSearchingActivities(false);
      }
    },
    []
  );

  const handleActivitySelect = useCallback(
    (e: { value: ActivityOption }) => {
      if (e.value) {
        handleFieldChange('specificActivity', e.value.description);
        handleFieldChange('activityCode', e.value.code);
      }
    },
    [handleFieldChange]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
          <i className="pi pi-building text-[#C9A84C]"></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Datos de Construcción</h3>
          <p className="text-sm text-gray-400">Especifique las características del inmueble</p>
        </div>
      </div>

      {/* Construction Type and Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Tipo constructivo <span className="text-red-400">*</span>
          </label>
          <Dropdown
            value={localData.type}
            options={constructionTypes}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => handleFieldChange('type', e.value)}
            placeholder="Seleccione"
            className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
            panelClassName="bg-[#1A1A2E] border border-gray-600"
          />
          {errors.type && <Message severity="error" text={errors.type} className="text-xs" />}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Año de construcción
          </label>
          <InputNumber
            value={localData.year}
            onChange={(e) => handleFieldChange('year', e.value)}
            min={1900}
            max={currentYear}
            placeholder={`1900-${currentYear}`}
            className="w-full"
            inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
          />
          {errors.year && <Message severity="error" text={errors.year} className="text-xs" />}
        </div>
      </div>

      {/* Levels and Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Número de niveles
          </label>
          <InputNumber
            value={localData.levels}
            onChange={(e) => handleFieldChange('levels', e.value)}
            min={1}
            max={50}
            placeholder="1"
            className="w-full"
            inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
          />
          {errors.levels && <Message severity="error" text={errors.levels} className="text-xs" />}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Uso del inmueble <span className="text-red-400">*</span>
          </label>
          <Dropdown
            value={localData.usage}
            options={propertyUsages}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => handleFieldChange('usage', e.value)}
            placeholder="Seleccione"
            className="w-full bg-[#1A1A2E] border border-gray-600 text-white"
            panelClassName="bg-[#1A1A2E] border border-gray-600"
          />
          {errors.usage && <Message severity="error" text={errors.usage} className="text-xs" />}
        </div>
      </div>

      {/* Activity with Autocomplete */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Giro específico <span className="text-red-400">*</span>
        </label>
        <AutoComplete
          value={localData.specificActivity}
          suggestions={activitySuggestions}
          completeMethod={(e) => searchActivities(e.query)}
          onChange={(e) => handleFieldChange('specificActivity', e.value)}
          onSelect={handleActivitySelect}
          field="description"
          placeholder="Ej. Restaurante, Tienda de ropa, Oficinas..."
          className="w-full"
          inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
          panelClassName="bg-[#1A1A2E] border border-gray-600"
          delay={300}
          minLength={3}
        />
        {isSearchingActivities && (
          <p className="text-xs text-gray-400">Buscando actividades...</p>
        )}
        {errors.specificActivity && <Message severity="error" text={errors.specificActivity} className="text-xs" />}
      </div>

      {/* Activity Code */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Clave de giro
        </label>
        <InputText
          value={localData.activityCode || ''}
          onChange={(e) => handleFieldChange('activityCode', e.target.value)}
          placeholder="Se asigna automáticamente o puede ingresar manualmente"
          className="w-full bg-[#1A1A2E] border border-gray-600 text-white focus:border-[#C9A84C]"
        />
        {localData.activityCode && (
          <p className="text-xs text-green-400">
            <i className="pi pi-check-circle mr-1"></i>
            Clave asignada: {localData.activityCode}
          </p>
        )}
      </div>

      {/* Validation Summary */}
      <div className="bg-[#252540] rounded-lg p-4 border border-[#C9A84C]/20">
        <h4 className="text-sm font-medium text-[#C9A84C] mb-2">Campos requeridos:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`flex items-center gap-2 ${localData.type ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.type ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>Tipo constructivo</span>
          </div>
          <div className={`flex items-center gap-2 ${localData.usage ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.usage ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>Uso del inmueble</span>
          </div>
          <div className={`flex items-center gap-2 ${localData.specificActivity ? 'text-green-400' : 'text-gray-500'}`}>
            <i className={`pi ${localData.specificActivity ? 'pi-check-circle' : 'pi-circle'}`}></i>
            <span>Giro específico</span>
          </div>
        </div>
      </div>
    </div>
  );
}
