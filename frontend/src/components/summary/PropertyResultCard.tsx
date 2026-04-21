import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { PropertyResult } from '../../types/premium.types';
import { formatCurrency } from '../../utils/currency';

interface PropertyResultCardProps {
  property: PropertyResult;
}

export function PropertyResultCard({ property }: PropertyResultCardProps) {
  const isCalculated = property.status === 'CALCULATED';

  const amountBodyTemplate = (rowData: { amount: number }) => {
    return <span className="font-semibold text-white">{formatCurrency(rowData.amount)}</span>;
  };

  const coverageCodeBodyTemplate = (rowData: { coverageCode: string }) => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs font-mono">
        {rowData.coverageCode}
      </span>
    );
  };

  return (
    <Card
      className={`${
        isCalculated
          ? 'bg-[#1A1A2E] border border-gray-700'
          : 'bg-[#1A1A2E] border border-red-500/50'
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCalculated ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
              }`}
            >
              <i className={`pi ${isCalculated ? 'pi-check' : 'pi-exclamation-triangle'} text-lg`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{property.name}</h3>
              <p className="text-xs text-gray-500 font-mono">{property.propertyId}</p>
            </div>
          </div>
          <Badge
            value={isCalculated ? 'CALCULADO' : 'INCOMPLETO'}
            severity={isCalculated ? 'success' : 'danger'}
            className={isCalculated ? 'bg-green-500' : 'bg-red-500'}
          />
        </div>

        {isCalculated ? (
          <>
            {/* Tabla de desglose */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Desglose por Cobertura</h4>
              <DataTable
                value={property.breakdown}
                className="p-datatable-sm"
                showGridlines={false}
                stripedRows
              >
                <Column
                  field="coverageCode"
                  header="Código"
                  body={coverageCodeBodyTemplate}
                  style={{ width: '100px' }}
                />
                <Column field="coverageName" header="Cobertura" />
                <Column
                  field="amount"
                  header="Prima"
                  body={amountBodyTemplate}
                  style={{ width: '120px', textAlign: 'right' }}
                />
              </DataTable>
            </div>

            {/* Subtotales */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prima Neta:</span>
                <span className="font-semibold text-white">
                  {formatCurrency(property.netPremium || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#C9A84C] font-semibold">Prima Comercial:</span>
                <span className="font-bold text-[#C9A84C] text-lg">
                  {formatCurrency(property.commercialPremium || 0)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Mensaje de incompleto */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <i className="pi pi-info-circle text-red-500 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium mb-1">Inmueble no calculable</p>
                  <p className="text-sm text-gray-400">
                    {property.incompleteReason || 'Faltan datos necesarios para el cálculo'}
                  </p>
                </div>
              </div>
            </div>

            {/* Botón para completar datos */}
            <Button
              label="Completar datos del inmueble"
              icon="pi pi-pencil"
              className="w-full bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none"
              onClick={() => {
                // Navegar a la edición del inmueble
                window.location.href = `/quote/${property.propertyId}/properties/details`;
              }}
            />
          </>
        )}
      </div>
    </Card>
  );
}
