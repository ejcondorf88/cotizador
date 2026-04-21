import { useState, useEffect, useCallback, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { searchSuscriptores } from '../../services/catalogoService';
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
  const [suggestions, setSuggestions] = useState<SuscriptorSearchResponse[]>([]);
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
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchSuscriptores(query);
      console.log('Suscriptor search results:', results);
      setSuggestions(results);
    } catch (err) {
      console.error('Error searching suscriptores:', err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleComplete = useCallback((event: { query: string }) => {
    const query = event.query.toUpperCase();
    
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
    (e: { value: SuscriptorSearchResponse }) => {
      const suscriptor = e.value;
      setInputValue(suscriptor.codigo);
      onChange({
        suscriptorId: suscriptor.id,
        codigo: suscriptor.codigo,
        nombre: suscriptor.nombre,
        tipo: suscriptor.tipo,
      });
    },
    [onChange]
  );

  const itemTemplate = (suscriptor: SuscriptorSearchResponse) => {
    return (
      <div className="flex flex-col p-2 hover:bg-[#1A1A2E] cursor-pointer">
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
          suggestions={suggestions}
          completeMethod={handleComplete}
          onSelect={handleSelect}
          itemTemplate={itemTemplate}
          field="codigo"
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${error ? 'p-invalid' : ''}`}
          inputClassName="w-full bg-[#1A1A2E] border border-gray-600 text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] uppercase"
          panelClassName="bg-[#252540] border border-gray-600 shadow-xl"
          delay={0}
          minLength={2}
        />
        {isSearching && (
          <i className="pi pi-spin pi-spinner text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        {!isSearching && (
          <i className="pi pi-search text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
      </div>
      {isSearching && <p className="text-xs text-gray-400">Buscando suscriptores...</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <p className="text-gray-500 text-xs">
        Escribe al menos 2 caracteres para buscar suscriptores
      </p>
    </div>
  );
}
