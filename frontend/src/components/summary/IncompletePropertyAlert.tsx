import { Message } from 'primereact/message';
import { Button } from 'primereact/button';

interface IncompletePropertyAlertProps {
  count: number;
  onComplete: () => void;
}

export function IncompletePropertyAlert({ count, onComplete }: IncompletePropertyAlertProps) {
  if (count === 0) return null;

  return (
    <div className="mb-6">
      <Message
        severity="warn"
        className="w-full bg-yellow-500/10 border border-yellow-500/30"
        content={
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
            <div className="flex items-start gap-3">
              <i className="pi pi-exclamation-triangle text-yellow-500 text-xl mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-400">
                  {count} inmueble{count > 1 ? 's' : ''} no pudo{count > 1 ? 'ron' : ''} ser calculado
                  {count > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Algunos inmuebles tienen datos incompletos. Puedes completarlos ahora o continuar
                  con los que sí fueron calculados.
                </p>
              </div>
            </div>
            <Button
              label="Completar datos"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={onComplete}
              className="bg-yellow-500 hover:bg-yellow-600 text-[#1A1A2E] border-none whitespace-nowrap"
            />
          </div>
        }
      />
    </div>
  );
}
