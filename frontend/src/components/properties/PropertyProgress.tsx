import { ProgressBar } from 'primereact/progressbar';

interface PropertyProgressProps {
  total: number;
  completed: number;
}

export function PropertyProgress({ total, completed }: PropertyProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-[#252540] border border-[#C9A84C]/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <i className="pi pi-chart-bar text-[#C9A84C]"></i>
          <span className="text-sm font-medium text-white">Progreso</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#C9A84C]">{completed}</span>
          <span className="text-gray-400"> de {total}</span>
          <span className="text-sm text-gray-400 ml-2">completados</span>
        </div>
      </div>

      <ProgressBar
        value={percentage}
        className="h-3 bg-gray-700"
        pt={{
          value: {
            className: `transition-all duration-500 ${
              percentage === 100
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : 'bg-gradient-to-r from-[#C9A84C] to-[#E5C47C]'
            }`,
          },
        }}
      />

      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>{percentage}% completado</span>
        {completed === total && total > 0 && (
          <span className="text-green-400 font-medium">¡Listo para finalizar!</span>
        )}
      </div>
    </div>
  );
}
