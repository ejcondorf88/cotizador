import { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCoverages } from '../../hooks/useCoverages';
import { MandatoryCoverage } from './MandatoryCoverage';
import { OptionalCoverage } from './OptionalCoverage';
import { CoverageSummary } from './CoverageSummary';
import { WizardStepIndicator } from '../wizard/WizardStepIndicator';
import { CoverageCode } from '../../types/coverage';

const steps = [
  { label: 'Asegurado', icon: '🏢', description: 'Datos de la empresa' },
  { label: 'Conducción', icon: '🧑‍💼', description: 'Información del agente' },
  { label: 'Vigencia', icon: '📅', description: 'Fechas y pago' },
  { label: 'Inmuebles', icon: '🏭', description: 'Datos de propiedades' },
  { label: 'Coberturas', icon: '🛡️', description: 'Selección de coberturas' },
  { label: 'Resumen', icon: '✓', description: 'Confirmación' },
];

export function CoverageStep() {
  const { id: quoteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    mandatory,
    optional,
    selected,
    selectedIds,
    loading,
    error,
    basePremium,
    totalPremium,
    toggle,
    saveCoverages,
    refresh,
  } = useCoverages(quoteId);

  const handleToggle = useCallback(
    (coverageId: CoverageCode) => {
      toggle(coverageId);
    },
    [toggle],
  );

  const handleContinue = async () => {
    if (!quoteId) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró el ID de la cotización',
        life: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await saveCoverages();
      if (response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Coberturas guardadas correctamente',
          life: 3000,
        });
        // Navigate to summary/step 6
        navigate(`/quote/${quoteId}/summary`);
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'No se pudo guardar las coberturas',
          life: 3000,
        });
      }
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'Error al guardar las coberturas',
        life: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (quoteId) {
      navigate(`/quote/${quoteId}/properties`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="text-center">
          <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="4"
            className="text-[#C9A84C]"
          />
          <p className="mt-4 text-gray-400">Cargando coberturas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Error al cargar</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button
              label="Reintentar"
              icon="pi pi-refresh"
              onClick={refresh}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <WizardStepIndicator currentStep={5} steps={steps} />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Configuración de Coberturas
          </h1>
          <p className="text-gray-400">
            Selecciona las coberturas que aplicarán a toda la cotización
          </p>
        </div>

        {/* Mandatory Coverages */}
        <MandatoryCoverage coverages={mandatory} />

        {/* Optional Coverages */}
        <OptionalCoverage
          coverages={optional}
          selectedIds={selectedIds}
          onToggle={handleToggle}
        />

        {/* Summary */}
        <CoverageSummary
          mandatoryCount={mandatory.length}
          optionalSelected={selected.filter((c) => c.type === 'OPTIONAL').length}
          totalCount={selected.length}
          basePremium={basePremium || totalPremium}
          currency="MXN"
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
          <Button
            label="← Atrás"
            onClick={handleBack}
            className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
            disabled={isSubmitting}
          />
          <Button
            label={isSubmitting ? 'Guardando...' : 'Continuar →'}
            icon={isSubmitting ? 'pi pi-spin pi-spinner' : undefined}
            onClick={handleContinue}
            loading={isSubmitting}
            className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none px-6 shadow-lg shadow-[#C9A84C]/20"
          />
        </div>
      </div>
    </div>
  );
}
