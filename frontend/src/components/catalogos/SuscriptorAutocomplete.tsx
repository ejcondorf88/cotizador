import { useState, useEffect, useCallback } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { useSuscriptoresAutocomplete } from '../../hooks/useCatalogos';
import type { SuscriptorSearchResponse } from '../../types/catalogo';

interface SuscriptorAutocompleteProps {
  value?: string;
  onChange: (value: {
    suscriptorId: string;
    codigo: string;
    nombre: string;
    tipo?: string;
  }) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function SuscriptorAutocomplete({
  value,
  onChange,
  error,
  placeholder = 'Ej: SUB-001 o nombre del suscriptor',
  disabled = false,
}: SuscriptorAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Sync with parent value
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data: suscriptores = [], isLoading } = useSuscriptoresAutocomplete(debouncedQuery);

  const handleChange = useCallback(
    (e: { value: unknown }) => {
      const newValue = e.value;
      if (typeof newValue === 'string') {
        setInputValue(newValue.toUpperCase());
      } else if (newValue && typeof newValue === 'object') {
        const suscriptor = newValue as SuscriptorSearchResponse;
        setInputValue(suscriptor.codigo);
        onChange({
          suscriptorId: suscriptor.id,
          codigo: suscriptor.codigo,
          nombre: suscriptor.nombre,
          tipo: suscriptor.tipo,
        });
      }
    },
    [onChange]
  );

  const handleSelect = useCallback(
    (e: { value: unknown }) => {
      if (e.value && typeof e.value === 'object') {
        const suscriptor = e.value as SuscriptorSearchResponse;
        setInputValue(suscriptor.codigo);
        onChange({
          suscriptorId: suscriptor.id,
          codigo: suscriptor.codigo,
          nombre: suscriptor.nombre,
          tipo: suscriptor.tipo,
        });
      }
    },
    [onChange]
  );

  const itemTemplate = (suscriptor: SuscriptorSearchResponse) => {
    return (
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">{suscriptor.nombre}</span>
          <span className="text-xs text-[#C9A84C] font-mono">{suscriptor.codigo}</span>
        </div>
        {suscriptor.tipo && (
          <span className="text-xs text-gray-400 mt-0.5">Tipo: {suscriptor.tipo}</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <AutoComplete
          value={inputValue}
          suggestions={suscriptores}
          completeMethod={handleChange}
          onChange={(e) => setInputValue(String(e.value))}
          onSelect={handleSelect}
          itemTemplate={itemTemplate}
          field="codigo"
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${error ? 'p-invalid' : ''}`}
          inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] uppercase"
          panelClassName="bg-[#252540] border-gray-600"
          delay={300}
          minLength={2}
        />
        {isLoading && (
          <i className="pi pi-spin pi-spinner text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        {!isLoading && (
          <i className="pi pi-search text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
      </div>
      {isLoading && <p className="text-xs text-gray-400">Buscando suscriptores...</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <p className="text-gray-500 text-xs">
        Escribe al menos 2 caracteres para buscar suscriptores
      </p>
    </div>
  );
}
