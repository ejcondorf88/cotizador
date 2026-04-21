import { useState, useEffect, useCallback } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { useAgentesAutocomplete } from '../../hooks/useCatalogos';
import type { AgenteSearchResponse } from '../../types/catalogo';

interface AgenteAutocompleteProps {
  value?: string;
  onChange: (value: {
    agenteId: string;
    codigo: string;
    nombre: string;
    email?: string;
    telefono?: string;
    oficinaId?: string;
    oficinaNombre?: string;
  }) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function AgenteAutocomplete({
  value,
  onChange,
  error,
  placeholder = 'Ej: AGT-001234 o nombre del agente',
  disabled = false,
}: AgenteAutocompleteProps) {
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

  const { data: agentes = [], isLoading } = useAgentesAutocomplete(debouncedQuery);

  const handleChange = useCallback(
    (e: { value: unknown }) => {
      const newValue = e.value;
      if (typeof newValue === 'string') {
        setInputValue(newValue.toUpperCase());
      } else if (newValue && typeof newValue === 'object') {
        const agente = newValue as AgenteSearchResponse;
        setInputValue(agente.codigo);
        onChange({
          agenteId: agente.id,
          codigo: agente.codigo,
          nombre: agente.nombre,
          email: agente.email,
          telefono: agente.telefono,
          oficinaId: agente.oficina?.id,
          oficinaNombre: agente.oficina?.nombre,
        });
      }
    },
    [onChange]
  );

  const handleSelect = useCallback(
    (e: { value: unknown }) => {
      if (e.value && typeof e.value === 'object') {
        const agente = e.value as AgenteSearchResponse;
        setInputValue(agente.codigo);
        onChange({
          agenteId: agente.id,
          codigo: agente.codigo,
          nombre: agente.nombre,
          email: agente.email,
          telefono: agente.telefono,
          oficinaId: agente.oficina?.id,
          oficinaNombre: agente.oficina?.nombre,
        });
      }
    },
    [onChange]
  );

  const itemTemplate = (agente: AgenteSearchResponse) => {
    return (
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">{agente.nombre}</span>
          <span className="text-xs text-[#C9A84C] font-mono">{agente.codigo}</span>
        </div>
        {agente.oficina && (
          <span className="text-xs text-gray-400 mt-0.5">
            Oficina: {agente.oficina.nombre} ({agente.oficina.ciudad})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <AutoComplete
          value={inputValue}
          suggestions={agentes}
          completeMethod={handleChange}
          onChange={(e) => setInputValue(String(e.value))}
          onSelect={handleSelect}
          itemTemplate={itemTemplate}
          field="codigo"
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${error ? 'p-invalid' : ''}`}
          inputClassName="w-full bg-[#252540] border border-gray-600 text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] uppercase"
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
      {isLoading && <p className="text-xs text-gray-400">Buscando agentes...</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <p className="text-gray-500 text-xs">
        Escribe al menos 2 caracteres para buscar agentes
      </p>
    </div>
  );
}
