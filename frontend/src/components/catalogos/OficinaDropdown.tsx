import { Dropdown } from 'primereact/dropdown';
import { useOficinas } from '../../hooks/useCatalogos';
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
  const { data: oficinas = [], isLoading } = useOficinas();

  // Find the selected oficina object based on value (could be ID or codigo)
  const selectedOficina = oficinas.find(
    (o) => o.id === value || o.codigo === value
  );

  const handleChange = (e: { value: string }) => {
    const oficina = oficinas.find((o) => o.id === e.value);
    if (oficina) {
      onChange({
        oficinaId: oficina.id,
        codigo: oficina.codigo,
        nombre: oficina.nombre,
      });
    }
  };

  const optionLabel = (oficina: Oficina) => {
    const ciudad = oficina.ciudad ? ` - ${oficina.ciudad}` : '';
    return `${oficina.nombre} (${oficina.codigo})${ciudad}`;
  };

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
