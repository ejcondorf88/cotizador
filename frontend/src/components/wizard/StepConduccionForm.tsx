import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { searchAgents } from '../../services/quoteService';
import type { Agent } from '../../types/quote';

interface StepConduccionFormProps {
  data: {
    agentKey: string;
    agentName: string;
    subscriber: string;
    office: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export function StepConduccionForm({ data, onChange, errors }: StepConduccionFormProps) {
  const [suggestions, setSuggestions] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState(data.agentKey);

  // Sync search query when agentKey changes externally
  useEffect(() => {
    setSearchQuery(data.agentKey);
  }, [data.agentKey]);

  const search = (event: { query: string }) => {
    const query = event.query;
    if (query.length >= 2) {
      const results = searchAgents(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

const onAgentSelect = (e: { value: unknown }) => {
  const value = e.value;
  if (typeof value === 'string') {
    // Manual entry
    onChange('agentKey', value.toUpperCase());
    onChange('agentName', '');
    onChange('subscriber', '');
    onChange('office', '');
  } else if (value && typeof value === 'object') {
    // Selected from dropdown
    const agent = value as Agent;
    onChange('agentKey', agent.key);
    onChange('agentName', agent.name);
    onChange('subscriber', agent.subscriber);
    onChange('office', agent.office);
    setSearchQuery(agent.key);
  }
};

  const itemTemplate = (agent: Agent) => {
    return (
      <div className="flex flex-col p-2">
        <span className="font-medium text-white">{agent.key}</span>
        <span className="text-sm text-gray-400">{agent.name}</span>
        <span className="text-xs text-gray-500">{agent.office}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white font-heading mb-2">
          🧑‍💼 Conducción
        </h2>
        <p className="text-gray-400">
          Selecciona el agente responsable de la cotización
        </p>
      </div>

      {/* Clave del agente */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Clave del agente <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <AutoComplete
            value={searchQuery}
            suggestions={suggestions}
            completeMethod={search}
            onChange={(e) => setSearchQuery(String(e.value))}
            onSelect={onAgentSelect}
            itemTemplate={itemTemplate}
            field="key"
            placeholder="Ej: AGT-001234 o nombre del agente"
            className={`w-full ${errors.agentKey ? 'p-invalid' : ''}`}
            inputClassName="w-full bg-[#252540] border border-gray-600 text-white placeholder-gray-500 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] uppercase"
            panelClassName="bg-[#252540] border-gray-600"
            delay={300}
            minLength={2}
          />
          <i className="pi pi-search text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.agentKey && (
          <p className="text-red-500 text-xs">{errors.agentKey}</p>
        )}
        <p className="text-gray-500 text-xs">
          Escribe al menos 2 caracteres para buscar
        </p>
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
          Suscriptor
        </label>
        <InputText
          value={data.subscriber}
          disabled
          className="w-full bg-[#1A1A2E] border border-gray-700 text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Oficina */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Oficina
        </label>
        <InputText
          value={data.office}
          disabled
          className="w-full bg-[#1A1A2E] border border-gray-700 text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Info box */}
      <div className="bg-[#252540] border border-[#C9A84C]/20 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <i className="pi pi-info-circle text-[#C9A84C] mt-0.5" />
          <div>
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">¿No encuentras el agente?</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contacta al administrador para registrar nuevos agentes en el sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
