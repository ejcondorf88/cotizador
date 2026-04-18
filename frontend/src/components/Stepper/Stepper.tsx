import { Button } from 'primereact/button';
import { Step } from './Step';
import { useStepper } from '../../hooks/useStepper';
import type { Step as StepType } from '../../types';

const steps: StepType[] = [
  {
    id: 1,
    title: 'Paso 1',
    description: 'El agente abre la app',
    icon: 'pi pi-mobile',
  },
  {
    id: 2,
    title: 'Paso 2',
    description: "Hace click en 'Nueva cotización'",
    icon: 'pi pi-plus-circle',
  },
  {
    id: 3,
    title: 'Paso 3',
    description: 'El sistema genera el folio (ej: COT-2024-00042)',
    icon: 'pi pi-file-o',
  },
  {
    id: 4,
    title: 'Paso 4',
    description: 'Nace la cotización en estado BORRADOR',
    icon: 'pi pi-pencil',
  },
  {
    id: 5,
    title: 'Paso 5',
    description: 'El agente ve la pantalla lista para capturar',
    icon: 'pi pi-check-circle',
  },
];

export function Stepper() {
  const { activeStep, next, previous, isFirst, isLast, totalSteps } = useStepper(steps.length);

  return (
    <div className="w-full">
      {/* Steps - Desktop Horizontal */}
      <div className="hidden lg:flex justify-between items-start mb-12 relative">
        {steps.map((step, index) => (
          <Step
            key={step.id}
            number={step.id}
            title={step.title}
            description={step.description}
            icon={step.icon}
            isActive={index === activeStep}
            isCompleted={index < activeStep}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
      
      {/* Steps - Mobile Vertical */}
      <div className="lg:hidden mb-8">
        <div className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  index === activeStep
                    ? 'bg-accent shadow-lg shadow-accent/30'
                    : index < activeStep
                    ? 'bg-accent/20 border-2 border-accent'
                    : 'bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <i
                  className={`pi ${step.icon} text-lg transition-colors duration-300 ${
                    index === activeStep
                      ? 'text-white'
                      : index < activeStep
                      ? 'text-accent'
                      : 'text-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h4
                  className={`font-heading text-sm font-bold mb-1 transition-colors duration-300 ${
                    index === activeStep ? 'text-accent' : 'text-primary'
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`font-body text-sm leading-relaxed transition-all duration-300 ${
                    index === activeStep ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.description}
                </p>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className="absolute left-6 w-0.5 h-6 bg-gray-200"
                  style={{ top: `${(index + 1) * 80 - 12}px` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Current step indicator */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-2 bg-accent/10 rounded-full">
          <span className="font-body text-sm text-accent font-medium">
            Paso {activeStep + 1} de {totalSteps}
          </span>
        </span>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          label="Anterior"
          icon="pi pi-arrow-left"
          onClick={previous}
          disabled={isFirst}
          outlined
          className="px-6 py-2"
          style={{
            borderColor: isFirst ? '#E5E7EB' : '#C9A84C',
            color: isFirst ? '#9CA3AF' : '#C9A84C',
          }}
        />
        <Button
          label={isLast ? 'Finalizar' : 'Siguiente'}
          icon={isLast ? 'pi pi-check' : 'pi pi-arrow-right'}
          iconPos="right"
          onClick={next}
          disabled={isLast}
          className="px-6 py-2"
          style={{
            backgroundColor: isLast ? '#22C55E' : '#C9A84C',
            borderColor: isLast ? '#22C55E' : '#C9A84C',
            color: 'white',
          }}
        />
      </div>
      
      {/* Progress bar */}
      <div className="mt-8 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{
            width: `${((activeStep + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
