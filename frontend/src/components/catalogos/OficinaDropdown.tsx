import { useState, useEffect, useRef, useCallback } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { getOficinas } from '../../services/catalogoService';
import type { Oficina } from '../../types/catalogo';

interface OficinaDropdownProps {
  value?: string;
  onChange: (value: { oficinaId: string; codigo: string; nombre: string }) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function OficinaDropdown({
  value,
  onChange,
  error,
  placeholder = 'Seleccione una oficina...',
  disabled = false,
}: OficinaDropdownProps) {
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internalValue, setInternalValue] = useState<string>(value || '');
  const isManualSelection = useRef(false);

  // Load offices on mount
  useEffect(() => {
    const loadOficinas = async () => {
      try {
        const results = await getOficinas();
        setOficinas(results);
      } catch (err) {
        console.error('Error loading oficinas:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOficinas();
  }, []);

  // Sync external value with internal state
  useEffect(() => {
    console.log('OficinaDropdown: useEffect triggered:', { value, internalValue, isManual: isManualSelection.current, oficinasCount: oficinas.length });
    
    if (value !== undefined && value !== internalValue && !isManualSelection.current) {
      console.log('OficinaDropdown: External value changed, syncing:', value);
      setInternalValue(value);
      // Find and notify parent about the selected office
      const oficina = oficinas.find((o) => o.id === value);
      console.log('OficinaDropdown: Found office:', oficina);
      if (oficina) {
        console.log('OficinaDropdown: Calling onChange with:', { oficinaId: oficina.id, codigo: oficina.codigo, nombre: oficina.nombre });
        onChange({
          oficinaId: oficina.id,
          codigo: oficina.codigo,
          nombre: oficina.nombre,
        });
      }
    }
    // Reset manual selection flag
    isManualSelection.current = false;
  }, [value, oficinas, internalValue, onChange]);

  const handleChange = useCallback((e: { value: string }) => {
    isManualSelection.current = true;
    setInternalValue(e.value);
    const oficina = oficinas.find((o) => o.id === e.value);
    if (oficina) {
      onChange({
        oficinaId: oficina.id,
        codigo: oficina.codigo,
        nombre: oficina.nombre,
      });
    }
  }, [oficinas, onChange]);

  const optionLabel = (oficina: Oficina) => {
    const ciudad = oficina.ciudad ? ` - ${oficina.ciudad}` : '';
    return `${oficina.nombre} (${oficina.codigo})${ciudad}`;
  };

  // Find the selected oficina for display
  const selectedOficina = oficinas.find((o) => o.id === (internalValue || value));

  return (
    <div className="space-y-2">
      <Dropdown
        value={selectedOficina?.id || ''}
        options={oficinas}
        optionLabel={optionLabel}
        optionValue="id"
        onChange={handleChange}
        placeholder={isLoading ? 'Cargando oficinas...' : placeholder}
        disabled={disabled || isLoading}
        className={`w-full ${error ? 'p-invalid' : ''}`}
        panelClassName="bg-[#252540] border-gray-600"
      />
      {isLoading && <p className="text-xs text-gray-400">Cargando oficinas...</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
