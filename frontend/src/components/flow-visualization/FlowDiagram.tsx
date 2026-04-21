import { useState } from 'react';

interface FlowStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  details: string[];
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 1,
    title: 'Frontend',
    subtitle: 'React + Axios',
    description: 'Usuario interactúa con la aplicación',
    icon: '🖥️',
    color: 'bg-blue-500',
    details: [
      'Usuario hace clic en "Ver Giros"',
      'React Hook se activa (useGiros)',
      'Axios prepara la petición HTTP',
      'Se añade JWT Token en header',
      'Se genera X-Request-ID',
    ],
  },
  {
    id: 2,
    title: 'API Gateway',
    subtitle: 'Spring Cloud :8080',
    description: 'Enrutamiento y validación',
    icon: '🚪',
    color: 'bg-green-500',
    details: [
      'Recibe: GET /api/v1/catalogos/giros',
      'Valida CORS (localhost:5173)',
      'Busca ruta en application.yml',
      'Aplica StripPrefix(2)',
      'Enruta a: ms-catalogos:3001',
    ],
  },
  {
    id: 3,
    title: 'Microservicio',
    subtitle: 'NestJS :3001',
    description: 'Lógica de negocio',
    icon: '⚙️',
    color: 'bg-purple-500',
    details: [
      'Express recibe petición',
      'Middleware de autenticación',
      'GirosController.getGiros()',
      'Valida DTOs (class-validator)',
      'Invoca GetGirosUseCase',
    ],
  },
  {
    id: 4,
    title: 'Repository',
    subtitle: 'TypeORM Adapter',
    description: 'Acceso a datos',
    icon: '📦',
    color: 'bg-orange-500',
    details: [
      'GiroRepositoryAdapter.findAll()',
      'Convierte Domain → TypeORM',
      'Genera query SQL',
      'Ejecuta en PostgreSQL',
      'Mapea resultados',
    ],
  },
  {
    id: 5,
    title: 'Base de Datos',
    subtitle: 'PostgreSQL :5432',
    description: 'Persistencia de datos',
    icon: '🗄️',
    color: 'bg-red-500',
    details: [
      'Connection Pool recibe query',
      'Ejecuta: SELECT * FROM giros',
      'Filtra WHERE activo = true',
      'Retorna ResultSet',
      'TypeORM mapea a entidades',
    ],
  },
  {
    id: 6,
    title: 'Response Chain',
    subtitle: 'Vuelta al Frontend',
    description: 'Flujo de respuesta',
    icon: '↩️',
    color: 'bg-teal-500',
    details: [
      'Repository → Service (Domain)',
      'Service → Controller (DTO)',
      'Controller retorna JSON',
      'Gateway añade CORS headers',
      'Axios recibe en Frontend',
    ],
  },
];

export const FlowDiagram = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const runSimulation = () => {
    setIsAnimating(true);
    setActiveStep(1);
    
    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      if (current > FLOW_STEPS.length) {
        clearInterval(interval);
        setIsAnimating(false);
        setActiveStep(null);
      } else {
        setActiveStep(current);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Flujo Técnico End-to-End
        </h2>
        <p className="text-gray-600 mb-4">
          Visualización del recorrido de una petición desde el Frontend hasta la Base de Datos
        </p>
        <button
          onClick={runSimulation}
          disabled={isAnimating}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            isAnimating
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAnimating ? '⏳ Simulando...' : '▶️ Simular Flujo'}
        </button>
      </div>

      {/* Flow Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 z-0" />
        
        {/* Animated Progress Line */}
        {isAnimating && (
          <div 
            className="absolute left-1/2 top-0 w-1 bg-blue-500 transform -translate-x-1/2 z-0 transition-all duration-700"
            style={{
              height: activeStep ? `${((activeStep - 1) / (FLOW_STEPS.length - 1)) * 100}%` : '0%',
            }}
          />
        )}

        {/* Steps */}
        <div className="space-y-8 relative z-10">
          {FLOW_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start gap-6 transition-all duration-500 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
              onMouseEnter={() => !isAnimating && setActiveStep(step.id)}
              onMouseLeave={() => !isAnimating && setActiveStep(null)}
            >
              {/* Step Card */}
              <div 
                className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  activeStep === step.id
                    ? `${step.color} text-white border-transparent shadow-lg scale-105`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">{step.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold px-2 py-1 rounded ${
                        activeStep === step.id ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
                      }`}>
                        Paso {step.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mt-1">{step.title}</h3>
                    <p className={`text-sm ${
                      activeStep === step.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                
                <p className={`text-sm mb-4 ${
                  activeStep === step.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>

                {/* Details List */}
                <div className={`space-y-2 ${
                  activeStep === step.id ? 'block' : 'hidden'
                }`}>
                  <h4 className="font-semibold text-sm text-white/80 border-b border-white/20 pb-2">
                    Detalles:
                  </h4>
                  <ul className="space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-white/90 flex items-start gap-2">
                        <span className="text-white/60">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Center Node */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full border-4 transition-all duration-300 ${
                  activeStep === step.id
                    ? `${step.color} border-white shadow-lg scale-150`
                    : 'bg-gray-300 border-gray-100'
                }`} />
              </div>

              {/* Empty space for alternating layout */}
              <div className="flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Frontend', value: '~50ms', color: 'bg-blue-100 text-blue-700' },
          { label: 'Gateway', value: '~30ms', color: 'bg-green-100 text-green-700' },
          { label: 'Servicio', value: '~120ms', color: 'bg-purple-100 text-purple-700' },
          { label: 'Database', value: '~80ms', color: 'bg-red-100 text-red-700' },
        ].map((metric, idx) => (
          <div key={idx} className={`p-4 rounded-lg ${metric.color} text-center`}>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-sm font-medium">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        Tiempo total estimado: <span className="font-semibold text-gray-700">~280ms</span> E2E
      </div>
    </div>
  );
};
