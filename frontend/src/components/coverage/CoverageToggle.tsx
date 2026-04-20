import type { Coverage } from '../../types/coverage';

interface CoverageToggleProps {
  coverage: Coverage;
  isActive: boolean;
  isLocked?: boolean;
  onToggle?: () => void;
}

export function CoverageToggle({
  coverage,
  isActive,
  isLocked = false,
  onToggle,
}: CoverageToggleProps) {
  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg border transition-all duration-200
        ${isActive ? 'border-amber-300 bg-amber-50 shadow-sm' : 'border-gray-200 bg-white'}
        ${isLocked ? 'bg-gray-50 border-gray-300' : 'hover:shadow-md'}
      `}
    >
      {/* Icon */}
      <div className="text-3xl flex-shrink-0">{coverage.icon}</div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-base">{coverage.name}</h3>
        <p className="text-sm text-gray-500 truncate">{coverage.description}</p>
      </div>

      {/* Status & Toggle */}
      <div className="flex items-center gap-3">
        {/* Lock icon for mandatory */}
        {isLocked && (
          <span className="text-gray-400 text-lg" title="Cobertura obligatoria">
            🔒
          </span>
        )}

        {/* Toggle Button */}
        <button
          type="button"
          className={`
            relative w-14 h-8 rounded-full transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
            ${isActive ? 'bg-amber-500' : 'bg-gray-300'}
            ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
          `}
          onClick={() => !isLocked && onToggle?.()}
          disabled={isLocked}
          aria-label={`${coverage.name}: ${isActive ? 'Activo' : 'Inactivo'}`}
          aria-pressed={isActive}
        >
          <span
            className={`
              absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md
              transition-transform duration-200 flex items-center justify-center
              text-amber-600 font-bold text-xs
              ${isActive ? 'translate-x-6' : 'translate-x-0'}
            `}
          >
            {isActive && '✓'}
          </span>
        </button>

        {/* Status Label */}
        <span
          className={`
            text-sm font-medium min-w-[5rem] text-right
            ${isLocked ? 'text-gray-500' : isActive ? 'text-amber-600' : 'text-gray-500'}
          `}
        >
          {isLocked ? 'Obligatoria' : isActive ? 'Activa' : 'Inactiva'}
        </span>
      </div>
    </div>
  );
}
