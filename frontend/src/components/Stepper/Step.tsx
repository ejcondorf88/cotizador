interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
  isLast: boolean;
}

export function Step({
  number,
  title,
  description,
  icon,
  isActive,
  isCompleted,
  isLast,
}: StepProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Step circle */}
      <div
        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive
            ? 'bg-accent shadow-lg shadow-accent/30'
            : isCompleted
            ? 'bg-accent/20 border-2 border-accent'
            : 'bg-gray-100 border-2 border-gray-200'
        }`}
      >
        <i
          className={`pi ${icon} text-2xl transition-colors duration-300 ${
            isActive ? 'text-white' : isCompleted ? 'text-accent' : 'text-gray-400'
          }`}
        />
      </div>
      
      {/* Step number badge */}
      <div
        className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
          isActive || isCompleted
            ? 'bg-primary text-white'
            : 'bg-gray-300 text-gray-600'
        }`}
      >
        {number}
      </div>
      
      {/* Step content */}
      <div className="mt-4 text-center max-w-[200px]">
        <h4
          className={`font-heading text-sm font-bold mb-2 transition-colors duration-300 ${
            isActive ? 'text-accent' : 'text-primary'
          }`}
        >
          {title}
        </h4>
        <p
          className={`font-body text-xs leading-relaxed transition-all duration-300 ${
            isActive ? 'text-gray-700 opacity-100' : 'text-gray-400 opacity-70'
          }`}
        >
          {description}
        </p>
      </div>
      
      {/* Connector line */}
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-[calc(100%+16px)] w-[calc(100%-32px)] h-0.5">
          <div
            className="h-full transition-all duration-500"
            style={{
              background: isCompleted
                ? 'linear-gradient(to right, #C9A84C, #C9A84C)'
                : 'linear-gradient(to right, #C9A84C 0%, #C9A84C 50%, #E5E7EB 50%, #E5E7EB 100%)',
              backgroundSize: isCompleted ? '100% 100%' : '200% 100%',
              backgroundPosition: isCompleted ? 'left' : 'right',
            }}
          />
        </div>
      )}
    </div>
  );
}
