import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export function QuoteEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-6">
        <i className="pi pi-inbox text-[#C9A84C] text-4xl" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2 font-heading">
        No hay cotizaciones pendientes
      </h2>
      
      <p className="text-gray-400 max-w-md mb-8">
        No tienes cotizaciones en estado borrador. Crea una nueva cotización para comenzar.
      </p>
      
      <Button
        label="Crear nueva cotización"
        icon="pi pi-plus"
        onClick={() => navigate('/quote')}
        className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none px-8 py-3"
      />
    </div>
  );
}
