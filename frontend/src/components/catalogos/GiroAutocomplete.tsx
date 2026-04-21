import { useState, useEffect, useCallback } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { useGirosAutocomplete } from '../../hooks/useCatalogos';
import type { Giro } from '../../types/catalogo';

interface GiroAutocompleteProps {
  value?: string;
  onChange: (value: { code: string; description: string }) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function GiroAutocomplete({
  value,
  onChange,
  error,
  placeholder = 'Ej. Restaurante, Tienda de ropa, Oficinas...',
  disabled = false,
}: GiroAutocompleteProps) {
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

  const { data: giros = [], isLoading } = useGirosAutocomplete(debouncedQuery);

  const handleChange = useCallback(
    (e: { value: unknown }) => {
      const newValue = e.value;
      if (typeof newValue === 'string') {
        setInputValue(newValue);
      } else if (newValue && typeof newValue === 'object') {
        const giro = newValue as Giro;
        setInputValue(giro.descripcion);
        onChange({
          code: giro.clave,
          description: giro.descripcion,
        });
      }
    },
    [onChange]
  );

  const handleSelect = useCallback(
    (e: { value: unknown }) => {
      if (e.value && typeof e.value === 'object') {
        const giro = e.value as Giro;
        setInputValue(giro.descripcion);
        onChange({
          code: giro.clave,
          description: giro.descripcion,
        });
      }
    },
    [onChange]
  );

  const itemTemplate = (giro: Giro) => {
    return (
      <div className="flex flex-col p-2">
        <span className="font-medium text-white">{giro.descripcion}</span>
        <span className="text-xs text-gray-400 mt-0.5">
          Clave: {giro.clave} | Sector: {giro.sector || 'N/A'} | Riesgo:{' '}
          <span
            className={`font-medium ${
              giro.riesgo === 'BAJO'
                ? 'text-green-400'
                : giro.riesgo === 'MEDIO'
                  ? 'text-yellow-400'
                  : giro.riesgo === 'ALTO'
                    ? 'text-orange-400'
                    : 'text-red-400'
            }`}
          >
            {giro.riesgo}
          </span>
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <AutoComplete
          value={inputValue}
          suggestions={giros}
          completeMethod={handleChange}
          onChange={(e) => setInputValue(String(e.value))}
          onSelect={handleSelect}
          itemTemplate={itemTemplate}
          field="descripcion"
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${error ? 'p-invalid' : ''}`}
          inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
          panelClassName="bg-[#252540] border border-gray-600"
          delay={300}
          minLength={3}
        />
        {isLoading && (
          <i className="pi pi-spin pi-spinner text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        {!isLoading && (
          <i className="pi pi-search text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
      </div>
      {isLoading && <p className="text-xs text-gray-400">Buscando giros...</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <p className="text-gray-500 text-xs">
        Escribe al menos 3 caracteres para buscar giros
      </p>
    </div>
  );
}
