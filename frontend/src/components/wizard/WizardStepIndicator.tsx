interface Step {
  label: string;
  icon: string;
}

interface WizardStepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function WizardStepIndicator({ currentStep, steps }: WizardStepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Línea de conexión */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-[#C9A84C] -translate-y-1/2 transition-all duration-500"
          style={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
          }}
        />

      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              {/* Círculo del paso */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg
                  transition-all duration-300 border-2
                  ${isActive 
                    ? 'bg-[#C9A84C] border-[#C9A84C] text-[#1A1A2E] scale-110' 
                    : isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'bg-[#1A1A2E] border-gray-600 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <i className="pi pi-check" />
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>

              {/* Label del paso */}
              <div className="mt-3 text-center">
                <p
                  className={`
                    text-xs font-medium transition-colors duration-300
                    ${isActive ? 'text-[#C9A84C]' : isCompleted ? 'text-green-500' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-600 mt-1">
                  Paso {stepNumber}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
