import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { formatCurrency } from '../../utils/currency';

interface PremiumTotalPanelProps {
  netPremium: number;
  commercialPremium: number;
  commercialFactor: number;
  propertiesCalculated: number;
  propertiesTotal: number;
  hasIncomplete: boolean;
}

export function PremiumTotalPanel({
  netPremium,
  commercialPremium,
  commercialFactor,
  propertiesCalculated,
  propertiesTotal,
  hasIncomplete,
}: PremiumTotalPanelProps) {
  return (
    <Card className="bg-[#1A1A2E] border border-[#C9A84C]/50 shadow-xl shadow-[#C9A84C]/10">
      <div className="p-4">
        {/* Header con badges */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#C9A84C] text-2xl">💰</span>
            <h2 className="text-xl font-bold text-white">Resumen de Prima</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              value={`Factor ${commercialFactor.toFixed(1)}x`}
              severity="warning"
              className="bg-[#C9A84C] text-[#1A1A2E] font-bold"
            />
            <Badge
              value={`${propertiesCalculated} de ${propertiesTotal} inmuebles`}
              severity={hasIncomplete ? 'danger' : 'success'}
              className={hasIncomplete ? 'bg-red-500' : 'bg-green-500'}
            />
          </div>
        </div>

        {/* Grid de totales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Prima Neta */}
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Prima Neta</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(netPremium)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Antes de factor comercial</p>
          </div>

          {/* Factor */}
          <div className="text-center p-4 bg-[#C9A84C]/10 rounded-lg border border-[#C9A84C]/30">
            <p className="text-[#C9A84C] text-sm mb-1">Factor Comercial</p>
            <p className="text-3xl font-bold text-[#C9A84C]">
              {commercialFactor.toFixed(1)}x
            </p>
            <p className="text-xs text-gray-500 mt-1">Multiplicador aplicado</p>
          </div>

          {/* Prima Comercial */}
          <div className="text-center p-4 bg-[#C9A84C]/20 rounded-lg border-2 border-[#C9A84C]">
            <p className="text-[#C9A84C] text-sm mb-1 font-semibold">
              Prima Comercial (Cliente)
            </p>
            <p className="text-3xl font-bold text-[#C9A84C]">
              {formatCurrency(commercialPremium)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Valor final a pagar</p>
          </div>
        </div>

        {/* Barra de progreso de inmuebles */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progreso de cálculo</span>
            <span className="text-sm text-gray-400">
              {propertiesCalculated} de {propertiesTotal} inmuebles calculados
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                hasIncomplete ? 'bg-yellow-500' : 'bg-[#C9A84C]'
              }`}
              style={{
                width: `${propertiesTotal > 0 ? (propertiesCalculated / propertiesTotal) * 100 : 0}%`,
              }}
            />
          </div>
          {hasIncomplete && (
            <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">
              <i className="pi pi-exclamation-circle" />
              Algunos inmuebles no pudieron ser calculados por datos incompletos
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
