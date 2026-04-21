import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { AgenteAutocomplete } from '../catalogos/AgenteAutocomplete';
import { SuscriptorAutocomplete } from '../catalogos/SuscriptorAutocomplete';
import { OficinaDropdown } from '../catalogos/OficinaDropdown';

interface StepConduccionFormProps {
  data: {
    agentKey: string;
    agentName: string;
    agentId?: string;
    subscriber: string;
    subscriberId?: string;
    office: string;
    officeId?: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export function StepConduccionForm({ data, onChange, errors }: StepConduccionFormProps) {
  const [selectedAgente, setSelectedAgente] = useState<{
    agenteId?: string;
    codigo?: string;
    nombre?: string;
    email?: string;
    telefono?: string;
    oficinaId?: string;
    oficinaNombre?: string;
  } | null>(null);

  const [selectedSuscriptor, setSelectedSuscriptor] = useState<{
    suscriptorId?: string;
    codigo?: string;
    nombre?: string;
    tipo?: string;
  } | null>(null);

  const [selectedOficina, setSelectedOficina] = useState<{
    oficinaId?: string;
    codigo?: string;
    nombre?: string;
  } | null>(null);

  // Sync with parent data on mount
  useEffect(() => {
    if (data.agentId) {
      setSelectedAgente({
        agenteId: data.agentId,
        codigo: data.agentKey,
        nombre: data.agentName,
        oficinaId: data.officeId,
        oficinaNombre: data.office,
      });
    }
    if (data.subscriberId) {
      setSelectedSuscriptor({
        suscriptorId: data.subscriberId,
        codigo: data.subscriber,
        nombre: data.subscriber,
      });
    }
    if (data.officeId) {
      setSelectedOficina({
        oficinaId: data.officeId,
        codigo: data.agentKey?.startsWith('AGT-') ? undefined : data.office,
        nombre: data.office,
      });
    }
  }, [data.agentId, data.subscriberId, data.officeId]);

  const handleAgenteChange = (value: {
    agenteId: string;
    codigo: string;
    nombre: string;
    email?: string;
    telefono?: string;
  }) => {
    setSelectedAgente(value);
    onChange('agentId', value.agenteId);
    onChange('agentKey', value.codigo);
    onChange('agentName', value.nombre);
  };

  const handleSuscriptorChange = (value: {
    suscriptorId: string;
    codigo: string;
    nombre: string;
    tipo?: string;
  }) => {
    setSelectedSuscriptor(value);
    onChange('subscriberId', value.suscriptorId);
    onChange('subscriber', value.nombre);
  };

  const handleOficinaChange = (value: {
    oficinaId: string;
    codigo: string;
    nombre: string;
  }) => {
    setSelectedOficina(value);
    onChange('officeId', value.oficinaId);
    onChange('office', value.nombre);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white font-heading mb-2">
          🧑‍💼 Conducción
        </h2>
        <p className="text-gray-400">
          Selecciona el agente, suscriptor y oficina para la cotización
        </p>
      </div>

      {/* Clave del agente */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Agente <span className="text-red-500">*</span>
        </label>
        <AgenteAutocomplete
          value={data.agentKey}
          onChange={handleAgenteChange}
          error={errors.agentKey}
          placeholder="Ej: AGT-001234 o nombre del agente"
        />
      </div>

      {/* Nombre del agente */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Nombre del agente
        </label>
        <InputText
          value={data.agentName}
          disabled
          className="w-full bg-[#1A1A2E] border border-gray-700 text-gray-400 cursor-not-allowed"
        />
        <p className="text-gray-500 text-xs">
          Se completa automáticamente al seleccionar el agente
        </p>
      </div>

      {/* Suscriptor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Suscriptor <span className="text-red-500">*</span>
        </label>
        <SuscriptorAutocomplete
          value={data.subscriber}
          onChange={handleSuscriptorChange}
          error={errors.subscriber}
          placeholder="Ej: SUB-001 o nombre del suscriptor"
        />
      </div>

      {/* Oficina */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Oficina <span className="text-red-500">*</span>
        </label>
        <OficinaDropdown
          value={data.officeId}
          onChange={handleOficinaChange}
          error={errors.office}
          placeholder="Seleccione una oficina..."
        />
      </div>

      {/* Info box */}
      <div className="bg-[#252540] border border-[#C9A84C]/20 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <i className="pi pi-info-circle text-[#C9A84C] mt-0.5" />
          <div>
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">¿No encuentras algún dato?</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contacta al administrador para registrar nuevos agentes, suscriptores o oficinas en el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
