import { useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
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
  { label: 'Asegurado', icon: '🏢' },
  { label: 'Conducción', icon: '🧑‍💼' },
  { label: 'Vigencia', icon: '📅' },
];

export function QuoteOnboardingWizard({ quote, visible, onHide, onSuccess }: QuoteOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(initialWizardFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateCurrentStep()) return;

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
        summary: 'Éxito',
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
    switch (currentStep) {
      case 1:
        return (
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
        );
      case 2:
        return (
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
        );
      case 3:
        const businessLine = catalogs.businessLines.find((l) => l.id === formData.businessLine);
        return (
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
        );
      default:
        return null;
    }
  };

  const footer = (
    <div className="flex justify-between items-center p-4 border-t border-gray-700">
      <div>
        {currentStep > 1 && (
          <Button
            label="← Anterior"
            onClick={handlePrevious}
            className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800"
          />
        )}
      </div>
      <div className="flex gap-3">
        <Button
          label="Cancelar"
          onClick={handleHide}
          className="bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10"
        />
        {currentStep < 3 ? (
          <Button
            label="Siguiente →"
            onClick={handleNext}
            className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none px-6"
          />
        ) : (
          <Button
            label="Completar Cotización"
            icon="pi pi-check"
            onClick={handleComplete}
            loading={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white border-none px-6"
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={`Cotización: ${quote.folioNumber}`}
        visible={visible}
        onHide={handleHide}
        style={{ width: '90vw', maxWidth: '800px' }}
        breakpoints={{ '960px': '95vw' }}
        className="bg-[#1A1A2E] border border-[#C9A84C]/30"
        contentClassName="bg-[#1A1A2E] text-white"
        headerClassName="bg-[#252540] text-white border-b border-[#C9A84C]/30"
        footer={footer}
        dismissableMask={false}
        closable={false}
      >
        <div className="p-4">
          <WizardStepIndicator currentStep={currentStep} steps={steps} />
          <div className="mt-6">
            {renderStepContent()}
          </div>
        </div>
      </Dialog>
    </>
  );
}
