import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { PropertyCountSelector } from '../components/properties/PropertyCountSelector';
import { useQuoteByIdQuery } from '../hooks/queries/useQuotesQuery';
import { useUpdateQuoteMutation } from '../hooks/queries/useUpdateQuoteMutation';
import { useCreatePropertiesBulkMutation } from '../hooks/queries/usePropertyQueries';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useRequireWizardCompletion } from '../hooks/useRequireWizardCompletion';
import type { Quote } from '../types/quote';

export function InsuredPropertiesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);

  // Require wizard completion - redirects if not from wizard
  const { isValid } = useRequireWizardCompletion();

  const [propertyCount, setPropertyCount] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch quote data
  const { data: quote, isLoading: isLoadingQuote } = useQuoteByIdQuery(id!);
  const updateMutation = useUpdateQuoteMutation();
  const createPropertiesMutation = useCreatePropertiesBulkMutation();

  // Show error toast from navigation state
  useEffect(() => {
    const errorMessage = location.state?.error;
    if (errorMessage && toast.current) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000,
      });
      // Clear the error from state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Set initial value if quote already has propertyCount
  useEffect(() => {
    if (quote?.propertyCount) {
      setPropertyCount(quote.propertyCount);
    }
  }, [quote]);

  const handleContinue = async () => {
    if (!id) return;

    // Validate
    if (propertyCount < 1) {
      setError('Seleccione al menos 1 inmueble');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // First, save the property count
      await updateMutation.mutateAsync({
        id,
        data: { propertyCount },
      });

      // Then, create the properties in bulk
      await createPropertiesMutation.mutateAsync({
        quoteId: id,
        data: { count: propertyCount },
      });

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: `${propertyCount} inmuebles creados. Redirigiendo...`,
        life: 2000,
      });

      // Redirect to properties details page
      navigate(`/quote/${id}/properties/details`, {
        state: { fromWizard: true },
      });
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err instanceof Error ? err.message : 'Error al crear los inmuebles',
        life: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    confirmDialog({
      message: '¿Desea cancelar? Se perderá el progreso',
      header: 'Confirmar cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No, continuar',
      acceptClassName: 'p-button-danger',
      accept: () => {
        navigate('/quotes');
      },
    });
  };

  // If not valid (redirected), don't render anything
  if (!isValid) {
    return null;
  }

  // Loading state
  if (isLoadingQuote) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <i className="pi pi-spin pi-spinner text-4xl text-[#C9A84C]"></i>
            <p className="text-gray-400">Cargando...</p>
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

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl bg-[#252540] border border-[#C9A84C]/30 shadow-2xl">
          <div className="p-8">
            <PropertyCountSelector
              value={propertyCount}
              onChange={(value) => {
                setPropertyCount(value);
                setError('');
              }}
              companyName={companyName}
              error={error}
            />

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-700">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 px-6"
              />

              <Button
                label={isSubmitting ? 'Guardando...' : 'Continuar'}
                icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-arrow-right'}
                iconPos="right"
                onClick={handleContinue}
                loading={isSubmitting}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#C9A84C] to-[#B8983E] hover:from-[#B8983E] hover:to-[#C9A84C] text-white border-none px-8 py-3 shadow-lg shadow-[#C9A84C]/20"
              />
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
