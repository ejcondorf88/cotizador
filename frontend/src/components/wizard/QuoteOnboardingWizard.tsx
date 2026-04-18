import { useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressBar } from 'primereact/progressbar';
import { useRef, useEffect } from 'react';
import { WizardStepIndicator } from './WizardStepIndicator';
import { StepAseguradoForm } from './StepAseguradoForm';
import { StepConduccionForm } from './StepConduccionForm';
import { StepVigenciaForm } from './StepVigenciaForm';
import { 
  useCompleteQuoteMutation, 
  initialWizardFormData, 
  type WizardFormData,
  validateStep1,
  validateStep2,
  validateStep3,
  prepareQuoteUpdateData,
} from '../../hooks/queries/useUpdateQuoteMutation';
import { catalogs } from '../../services/quoteService';
import type { Quote } from '../../types/quote';

interface QuoteOnboardingWizardProps {
  quote: Quote;
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const steps = [
  { label: 'Asegurado', icon: '🏢', description: 'Datos de la empresa' },
  { label: 'Conducción', icon: '🧑‍💼', description: 'Información del agente' },
  { label: 'Vigencia', icon: '📅', description: 'Fechas y pago' },
];

export function QuoteOnboardingWizard({ quote, visible, onHide, onSuccess }: QuoteOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(initialWizardFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const toast = useRef<Toast>(null);
  const completeMutation = useCompleteQuoteMutation();

  // Load saved progress from localStorage
  useEffect(() => {
    if (visible && quote) {
      const savedData = localStorage.getItem(`quote-wizard-${quote.id}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData({
            ...initialWizardFormData,
            ...parsed,
            validityStart: parsed.validityStart ? new Date(parsed.validityStart) : null,
            validityEnd: parsed.validityEnd ? new Date(parsed.validityEnd) : null,
          });
        } catch {
          // Invalid saved data, ignore
        }
      }
    }
  }, [visible, quote]);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    if (quote) {
      localStorage.setItem(`quote-wizard-${quote.id}`, JSON.stringify(formData));
    }
  }, [formData, quote]);

  useEffect(() => {
    if (visible) {
      saveProgress();
    }
  }, [formData, visible, saveProgress]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    let stepErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        stepErrors = validateStep1({
          companyName: formData.companyName,
          rfc: formData.rfc,
          businessLine: formData.businessLine,
          businessType: formData.businessType,
        });
        break;
      case 2:
        stepErrors = validateStep2({ agentKey: formData.agentKey });
        break;
      case 3:
        stepErrors = validateStep3({
          validityStart: formData.validityStart,
          validityEnd: formData.validityEnd,
          currency: formData.currency,
          paymentType: formData.paymentType,
        });
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const animateStepChange = (newStep: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setIsAnimating(false);
    }, 150);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
        animateStepChange(currentStep + 1);
      }
    } else {
      // Shake animation or error feedback
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor completa todos los campos obligatorios',
        life: 3000,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      animateStepChange(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateCurrentStep()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor completa todos los campos antes de continuar',
        life: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await completeMutation.mutateAsync({
        id: quote.id,
        data: prepareQuoteUpdateData(formData),
      });

      // Clear localStorage
      localStorage.removeItem(`quote-wizard-${quote.id}`);

      toast.current?.show({
        severity: 'success',
        summary: '¡Éxito!',
        detail: 'Cotización completada exitosamente',
        life: 3000,
      });

      // Reset form
      setFormData(initialWizardFormData);
      setCurrentStep(1);

      onSuccess();
      onHide();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error instanceof Error ? error.message : 'Error al completar la cotización',
        life: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHide = () => {
    // Check if there's unsaved data
    const hasData = Object.values(formData).some((v) => {
      if (v === null || v === undefined) return false;
      if (typeof v === 'string') return v.length > 0;
      if (v instanceof Date) return true;
      return false;
    });

    if (hasData) {
      const confirm = window.confirm('Tienes datos sin guardar. ¿Seguro que deseas salir? Tu progreso se mantendrá guardado.');
      if (!confirm) return;
    }

    onHide();
  };

  const renderStepContent = () => {
    const businessLine = catalogs.businessLines.find((l) => l.id === formData.businessLine);
    
    switch (currentStep) {
      case 1:
        return (
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <StepAseguradoForm
              data={{
                companyName: formData.companyName,
                rfc: formData.rfc,
                businessLine: formData.businessLine,
                businessType: formData.businessType,
              }}
              onChange={handleChange}
              errors={errors}
            />
          </div>
        );
      case 2:
        return (
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <StepConduccionForm
              data={{
                agentKey: formData.agentKey,
                agentName: formData.agentName,
                subscriber: formData.subscriber,
                office: formData.office,
              }}
              onChange={handleChange}
              errors={errors}
            />
          </div>
        );
      case 3:
        return (
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <StepVigenciaForm
              data={{
                validityStart: formData.validityStart,
                validityEnd: formData.validityEnd,
                currency: formData.currency,
                paymentType: formData.paymentType,
              }}
              summary={{
                companyName: formData.companyName,
                rfc: formData.rfc,
                businessLine: businessLine?.name || formData.businessLine,
                agentKey: formData.agentKey,
                agentName: formData.agentName,
              }}
              onChange={handleChange}
              errors={errors}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <Dialog
        header={
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white">
              Completar Cotización
            </span>
            <span className="text-sm text-[#C9A84C]">
              {quote.folioNumber}
            </span>
          </div>
        }
        visible={visible}
        onHide={handleHide}
        style={{ width: '95vw', maxWidth: '900px' }}
        breakpoints={{ '960px': '98vw' }}
        className="bg-[#1A1A2E] border border-[#C9A84C]/30"
        contentClassName="bg-[#1A1A2E] text-white p-0"
        headerClassName="bg-[#252540] text-white border-b border-[#C9A84C]/30 pb-4"
        footer={null}
        dismissableMask={false}
        closable={true}
        closeIcon="pi pi-times text-gray-400 hover:text-white"
      >
        <div className="flex flex-col h-full">
          {/* Progress Bar */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Paso {currentStep} de {steps.length}</span>
              <span>{Math.round(progressValue)}% completado</span>
            </div>
            <ProgressBar 
              value={progressValue} 
              showValue={false}
              className="h-2 bg-gray-700"
              pt={{
                value: { className: 'bg-gradient-to-r from-[#C9A84C] to-[#E5C47C]' }
              }}
            />
          </div>

          {/* Stepper */}
          <div className="px-6 py-4">
            <WizardStepIndicator currentStep={currentStep} steps={steps} />
          </div>

          {/* Form Content */}
          <div className="flex-1 px-6 py-4 overflow-y-auto max-h-[60vh]">
            {renderStepContent()}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-700 bg-[#252540]/50">
            <div className="flex justify-between items-center">
              <div>
                {currentStep > 1 && (
                  <Button
                    label="← Anterior"
                    onClick={handlePrevious}
                    className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                    disabled={isSubmitting}
                  />
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  label="Cancelar"
                  onClick={handleHide}
                  className="bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10"
                  disabled={isSubmitting}
                />
                {currentStep < 3 ? (
                  <Button
                    label="Siguiente →"
                    onClick={handleNext}
                    className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none px-6 shadow-lg shadow-[#C9A84C]/20"
                    disabled={isSubmitting}
                  />
                ) : (
                  <Button
                    label={isSubmitting ? 'Guardando...' : 'Completar Cotización'}
                    icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                    onClick={handleComplete}
                    loading={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-none px-6 shadow-lg shadow-green-500/20"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
