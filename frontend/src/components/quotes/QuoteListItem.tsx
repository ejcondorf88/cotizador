import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import type { Quote } from '../../types/quote';

interface QuoteListItemProps {
  quote: Quote;
  onComplete: (quote: Quote) => void;
}

export function QuoteListItem({ quote, onComplete }: QuoteListItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const header = (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1A1A2E] to-[#252540] border-b border-[#C9A84C]/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center">
          <i className="pi pi-file text-[#C9A84C] text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-heading">
            {quote.folioNumber}
          </h3>
          <p className="text-sm text-gray-400">
            Creado el {formatDate(quote.createdAt)}
          </p>
        </div>
      </div>
      <Badge
        value="Pendiente"
        severity="warning"
        className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]"
      />
    </div>
  );

  const footer = (
    <div className="flex justify-end p-4">
      <Button
        label="Completar Datos"
        icon="pi pi-pencil"
        onClick={() => onComplete(quote)}
        className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none px-6"
      />
    </div>
  );

  return (
    <Card
      header={header}
      footer={footer}
      className="bg-[#1A1A2E] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A84C]/10"
    >
      <div className="p-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <i className="pi pi-clock" />
          <span>Esperando información del asegurado</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <i className="pi pi-info-circle" />
          <span>Haz clic para completar los datos requeridos</span>
        </div>
      </div>
    </Card>
  );
}
