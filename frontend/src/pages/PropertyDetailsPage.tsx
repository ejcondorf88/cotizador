import { useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { PropertyCard } from '../components/properties/PropertyCard';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useRequireWizardCompletion } from '../hooks/useRequireWizardCompletion';
import { useQuoteByIdQuery } from '../hooks/queries/useQuotesQuery';
import {
  usePropertiesByQuoteQuery,
  useUpdatePropertyMutation,
  useDeletePropertiesMutation,
} from '../hooks/queries/usePropertyQueries';
import { useUpdateQuoteMutation } from '../hooks/queries/useUpdateQuoteMutation';
import type { Property, UpdatePropertyRequest } from '../types/property';

export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  // Require wizard completion
  const { isValid } = useRequireWizardCompletion();

  // Local state
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Fetch quote and properties
  const { data: quote, isLoading: isLoadingQuote } = useQuoteByIdQuery(id!);
  const {
    data: propertiesData,
    isLoading: isLoadingProperties,
    refetch: refetchProperties,
  } = usePropertiesByQuoteQuery(id!);

  // Mutations
  const updatePropertyMutation = useUpdatePropertyMutation();
  const deletePropertiesMutation = useDeletePropertiesMutation();
  const updateQuoteMutation = useUpdateQuoteMutation();

  const properties = propertiesData?.properties || [];
  const total = propertiesData?.total || 0;
  const completed = propertiesData?.completed || 0;
  const allComplete = completed === total && total > 0;
  const totalSumInsured = propertiesData?.totalSumInsured || 0;

  const handleToggleCard = useCallback(
    (index: number) => {
      setExpandedIndex((prev) => (prev === index ? -1 : index));
    },
    [setExpandedIndex]
  );

  const handleSaveProperty = useCallback(
    async (propertyId: string, data: UpdatePropertyRequest) => {
      if (!id) return;

      try {
        await updatePropertyMutation.mutateAsync({
          propertyId,
          quoteId: id,
          data,
        });

        toast.current?.show({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Inmueble actualizado correctamente',
          life: 2000,
        });

        // Refetch properties to check completion status
        await refetchProperties();
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error instanceof Error ? error.message : 'Error al guardar',
          life: 3000,
        });
      }
    },
    [id, updatePropertyMutation, refetchProperties]
  );

  const handleCancel = useCallback(() => {
    confirmDialog({
      message: '¿Desea cancelar? Se perderán todos los inmuebles creados.',
      header: 'Confirmar cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No, continuar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        if (!id) return;

        try {
          await deletePropertiesMutation.mutateAsync({ quoteId: id });
          navigate('/quotes');
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron eliminar los inmuebles',
            life: 3000,
          });
        }
      },
    });
  }, [id, deletePropertiesMutation, navigate]);

  const handleFinalize = useCallback(async () => {
    // Múltiples guards para prevenir doble submit
    if (!id || !allComplete || isFinalizing || hasNavigated) return;

    setIsFinalizing(true);

    try {
      // Update quote status to IN_PROGRESS
      await updateQuoteMutation.mutateAsync({
        id,
        data: { status: 'IN_PROGRESS' },
      });

      // Marcar que ya navegamos para prevenir dobles
      setHasNavigated(true);

      toast.current?.show({
        severity: 'success',
        summary: '¡Éxito!',
        detail: 'Redirigiendo a selección de coberturas...',
        life: 2000,
      });

      // Redirección con delay para UX y replace para no volver atrás
      setTimeout(() => {
        navigate(`/quote/${id}/coverage`, { replace: true });
      }, 500);
    } catch (error) {
      // Reset estado para permitir reintentar
      setHasNavigated(false);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error instanceof Error ? error.message : 'Error al finalizar',
        life: 5000,
      });
    } finally {
      setIsFinalizing(false);
    }
  }, [id, allComplete, isFinalizing, hasNavigated, updateQuoteMutation, navigate]);

  // If not valid (redirected), don't render
  if (!isValid) {
    return null;
  }

  // Loading state
  if (isLoadingQuote || isLoadingProperties) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <i className="pi pi-spin pi-spinner text-4xl text-[#C9A84C]"></i>
            <p className="text-gray-400">Cargando inmuebles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const companyName = quote?.details?.companyName || 'Su empresa';

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col">
      <Toast ref={toast} position="top-center" />
      <ConfirmDialog />

      <Navbar />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <Card className="bg-[#252540] border border-[#C9A84C]/30">
            <div className="text-center space-y-4 p-4">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mx-auto">
                <i className="pi pi-building text-3xl text-[#C9A84C]"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Detalle de Inmuebles</h1>
                <p className="text-[#C9A84C] font-medium">{companyName}</p>
              </div>
            </div>
          </Card>

      {/* Progress Overview */}
          <div className="bg-[#252540] rounded-lg p-4 border border-[#C9A84C]/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
              <i className="pi pi-chart-bar text-[#C9A84C] text-xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Progreso del Proceso</h2>
              <p className="text-sm text-gray-400">
                {completed} de {total} inmuebles completados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-400">Suma Asegurada Total</p>
              <p className="text-xl font-bold text-[#C9A84C]">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                  minimumFractionDigits: 0,
                }).format(totalSumInsured)}
              </p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={allComplete ? '#22C55E' : '#C9A84C'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(completed / total) * 175.93} 175.93`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {Math.round((completed / total) * 100) || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
          <div className="space-y-4">
        {properties.length === 0 && (
          <div className="text-center py-12 bg-[#252540] rounded-lg border border-gray-700">
            <i className="pi pi-home text-4xl text-gray-600 mb-4"></i>
            <p className="text-gray-400">No hay inmuebles configurados</p>
            <Button
              label="Volver"
              onClick={() => navigate(`/quote/${id}/properties`)}
              className="mt-4 bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none"
            />
          </div>
        )}

            {properties.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            propertyIndex={index + 1}
            isExpanded={expandedIndex === index}
            isSaving={updatePropertyMutation.isPending}
            onToggle={() => handleToggleCard(index)}
            onSave={(data) => handleSaveProperty(property.id, data)}
            autoSave={true}
          />
        ))}
      </div>

          {/* Action Buttons */}
          {properties.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-700">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={handleCancel}
                disabled={isFinalizing}
                className="w-full sm:w-auto bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 px-6"
              />

              <div className="text-center sm:text-right">
                {!allComplete && (
                  <p className="text-sm text-yellow-400 mb-2">
                    Complete todos los inmuebles antes de finalizar
                  </p>
                )}
              <Button
                label={isFinalizing ? 'Finalizando...' : 'Finalizar'}
                icon={isFinalizing ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                onClick={handleFinalize}
                loading={isFinalizing}
                disabled={isFinalizing || !allComplete || hasNavigated}
                className={`w-full sm:w-auto px-8 py-3 border-none ${
                  allComplete
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
