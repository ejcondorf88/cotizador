import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { premiumService } from '../services/premiumService';
import { WizardStepIndicator } from '../components/wizard/WizardStepIndicator';
import { PremiumTotalPanel } from '../components/summary/PremiumTotalPanel';
import { PropertyResultCard } from '../components/summary/PropertyResultCard';
import { IncompletePropertyAlert } from '../components/summary/IncompletePropertyAlert';
import { formatCurrency } from '../utils/currency';
import type { PremiumCalculationResult } from '../types/premium.types';

const steps = [
  { label: 'Asegurado', icon: '🏢', description: 'Datos de la empresa' },
  { label: 'Conducción', icon: '🧑‍💼', description: 'Información del agente' },
  { label: 'Vigencia', icon: '📅', description: 'Fechas y pago' },
  { label: 'Inmuebles', icon: '🏭', description: 'Datos de propiedades' },
  { label: 'Coberturas', icon: '🛡️', description: 'Selección de coberturas' },
  { label: 'Resumen', icon: '✓', description: 'Confirmación' },
];

export function SummaryPage() {
  const { id: quoteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [result, setResult] = useState<PremiumCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasIncomplete = result?.properties.some((p) => p.status === 'INCOMPLETE') ?? false;
  const incompleteCount =
    result?.properties.filter((p) => p.status === 'INCOMPLETE').length ?? 0;

  useEffect(() => {
    if (!quoteId) {
      setError('No se encontró el ID de la cotización');
      setIsLoading(false);
      return;
    }

    fetchPremiumResult();
  }, [quoteId]);

  const fetchPremiumResult = async () => {
    if (!quoteId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await premiumService.getPremiumResult(quoteId);
      setResult(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error cargando el resultado';
      setError(message);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecalculate = async () => {
    if (!quoteId) return;

    setIsRecalculating(true);
    try {
      const response = await premiumService.calculatePremium(quoteId);
      setResult(response);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Prima recalculada correctamente',
        life: 3000,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error recalculando la prima';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleDownload = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Descarga',
      detail: 'Descargando cotización...',
      life: 3000,
    });
    // Implementar lógica de descarga aquí
  };

  const handleNewQuote = () => {
    navigate('/quote');
  };

  const handleCompleteProperties = () => {
    if (quoteId) {
      navigate(`/quote/${quoteId}/properties`);
    }
  };

  const handleBack = () => {
    if (quoteId) {
      navigate(`/quote/${quoteId}/coverage`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="text-center">
          <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="4"
            className="text-[#C9A84C]"
          />
          <p className="mt-4 text-gray-400">Cargando resumen...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error al cargar</h2>
          <p className="text-gray-400 mb-4">{error || 'No se pudo cargar el resumen'}</p>
          <div className="flex gap-3 justify-center">
            <Button
              label="Reintentar"
              icon="pi pi-refresh"
              onClick={fetchPremiumResult}
              className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none"
            />
            <Button
              label="Volver"
              onClick={handleBack}
              className="bg-transparent border border-gray-600 text-gray-300"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      <Toast ref={toast} position="top-center" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <WizardStepIndicator currentStep={6} steps={steps} />
        </div>

        {/* Header con información del folio */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Resumen de Cotización</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">
                  Folio: <span className="text-[#C9A84C] font-mono">{result.folio}</span>
                </span>
                <Badge
                  value={result.status}
                  severity="success"
                  className="bg-green-500 text-white"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Calculado el</p>
              <p className="text-sm text-gray-400">
                {new Date(result.calculatedAt).toLocaleString('es-MX', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">Versión: {result.version}</p>
            </div>
          </div>
        </div>

        {/* Alerta de inmuebles incompletos */}
        {hasIncomplete && (
          <IncompletePropertyAlert count={incompleteCount} onComplete={handleCompleteProperties} />
        )}

        {/* Panel de totales */}
        <div className="mb-8">
          <PremiumTotalPanel
            netPremium={result.netPremium}
            commercialPremium={result.commercialPremium}
            commercialFactor={result.commercialFactor}
            propertiesCalculated={result.propertiesCalculated}
            propertiesTotal={result.propertiesTotal}
            hasIncomplete={hasIncomplete}
          />
        </div>

        {/* Grid de resultados por inmueble */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[#C9A84C]">🏢</span>
            Desglose por Inmueble
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.properties.map((property) => (
              <PropertyResultCard key={property.propertyId} property={property} />
            ))}
          </div>
        </div>

        {/* Alertas */}
        {result.alerts.length > 0 && (
          <div className="mb-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
              <i className="pi pi-exclamation-circle" />
              Alertas
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {result.alerts.map((alert, index) => (
                <li key={index} className="text-gray-400 text-sm">
                  {alert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-700">
          <Button
            label="← Atrás"
            onClick={handleBack}
            className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              label={isRecalculating ? 'Recalculando...' : 'Recalcular'}
              icon={isRecalculating ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'}
              onClick={handleRecalculate}
              loading={isRecalculating}
              className="bg-gray-700 hover:bg-gray-600 text-white border-none"
            />
            <Button
              label="Descargar"
              icon="pi pi-download"
              onClick={handleDownload}
              className="bg-gray-700 hover:bg-gray-600 text-white border-none"
            />
            <Button
              label="Nueva Cotización"
              icon="pi pi-plus"
              onClick={handleNewQuote}
              className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none px-6 shadow-lg shadow-[#C9A84C]/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
