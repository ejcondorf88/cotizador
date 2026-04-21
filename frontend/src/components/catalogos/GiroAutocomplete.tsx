import { useState, useEffect, useCallback, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { searchGiros } from '../../services/catalogoService';
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
  const [suggestions, setSuggestions] = useState<Giro[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with parent value
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchGiros(query);
      setSuggestions(results);
    } catch (err) {
      console.error('Error searching giros:', err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleComplete = useCallback((event: { query: string }) => {
    const query = event.query;
    
    // Update input value
    setInputValue(query);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 200);
  }, [handleSearch]);

  const handleSelect = useCallback(
    (e: { value: Giro }) => {
      const giro = e.value;
      setInputValue(giro.descripcion);
      onChange({
        code: giro.clave,
        description: giro.descripcion,
      });
    },
    [onChange]
  );

  const itemTemplate = (giro: Giro) => {
    return (
      <div className="flex flex-col p-2 hover:bg-[#1A1A2E] cursor-pointer">
        <span className="font-medium text-white">{giro.descripcion}</span>
        <span className="text-xs text-gray-400 mt-0.5">
          Clave: <span className="text-[#C9A84C] font-mono">{giro.clave}</span> | Sector: {giro.sector || 'N/A'} | Riesgo:{' '}
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
          suggestions={suggestions}
          completeMethod={handleComplete}
          onSelect={handleSelect}
          itemTemplate={itemTemplate}
          field="descripcion"
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${error ? 'p-invalid' : ''}`}
          inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]"
          panelClassName="bg-[#252540] border border-gray-600 shadow-xl"
          delay={0}
          minLength={3}
        />
        {isSearching && (
          <i className="pi pi-spin pi-spinner text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        {!isSearching && (
          <i className="pi pi-search text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
      </div>
      {isSearching && <p className="text-xs text-gray-400">Buscando giros...</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <p className="text-gray-500 text-xs">
        Escribe al menos 3 caracteres para buscar giros
      </p>
    </div>
  );
}
