import { useState, useCallback, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { PropertyLocationSection } from './PropertyLocationSection';
import { PropertyConstructionSection } from './PropertyConstructionSection';
import { PropertyCoverageSection } from './PropertyCoverageSection';
import { PropertySummarySection } from './PropertySummarySection';
import type { Property, PropertyAddress, ConstructionDetails, PropertyCoverages, UpdatePropertyRequest } from '../../types/property';
import { ConstructionType, PropertyUsage } from '../../types/property';

interface PropertyStepperProps {
  property: Property;
  onSave: (data: UpdatePropertyRequest) => void;
  isSaving: boolean;
}

const steps = [
  { label: 'Ubicación', icon: '📍', description: 'Dirección del inmueble' },
  { label: 'Construcción', icon: '🏗️', description: 'Características' },
  { label: 'Garantías', icon: '🛡️', description: 'Coberturas' },
  { label: 'Resumen', icon: '✅', description: 'Verificación' },
];

export function PropertyStepper({
  property,
  onSave,
  isSaving,
}: PropertyStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<{
    name: string;
    address: PropertyAddress;
    construction: ConstructionDetails;
    coverages: PropertyCoverages;
  }>({
    name: property.name || '',
    address: property.address || {
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    construction: property.construction || {
      type: ConstructionType.CONCRETO,
      usage: PropertyUsage.COMERCIAL,
      specificActivity: '',
    },
    coverages: property.coverages || {
      building: 0,
      contents: 0,
      electronicEquipment: 0,
      machinery: 0,
      stock: 0,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useRef<Toast>(null);

  // Solo guardar al final (paso 4)
  const handleFinalSave = useCallback(() => {
    const updateData: UpdatePropertyRequest = {
      name: formData.name,
      address: formData.address,
      constructionType: formData.construction.type,
      constructionYear: formData.construction.year,
      levels: formData.construction.levels,
      propertyUsage: formData.construction.usage,
      specificActivity: formData.construction.specificActivity,
      activityCode: formData.construction.activityCode,
      coverageBuilding: formData.coverages.building,
      coverageContents: formData.coverages.contents,
      coverageElectronic: formData.coverages.electronicEquipment,
      coverageMachinery: formData.coverages.machinery,
      coverageStock: formData.coverages.stock,
    };

    onSave(updateData);
  }, [formData, onSave]);

  const handleLocationChange = useCallback(
    (data: { name: string; address: PropertyAddress }) => {
      setFormData((prev) => ({
        ...prev,
        name: data.name,
        address: data.address,
      }));
    },
    []
  );

  const handleConstructionChange = useCallback(
    (data: ConstructionDetails) => {
      setFormData((prev) => ({
        ...prev,
        construction: data,
      }));
    },
    []
  );

  const handleCoverageChange = useCallback(
    (data: PropertyCoverages) => {
      setFormData((prev) => ({
        ...prev,
        coverages: data,
      }));
    },
    []
  );

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Location
        if (!formData.name?.trim()) {
          newErrors.name = 'El nombre es obligatorio';
        }
        if (!formData.address?.street?.trim()) {
          newErrors.street = 'La calle es obligatoria';
        }
        if (!/^\d{5}$/.test(formData.address?.zipCode || '')) {
          newErrors.zipCode = 'El código postal debe tener 5 dígitos';
        }
        if (!formData.address?.state?.trim()) {
          newErrors.state = 'El estado es obligatorio';
        }
        if (!formData.address?.city?.trim()) {
          newErrors.city = 'La ciudad es obligatoria';
        }
        if (!formData.address?.neighborhood?.trim()) {
          newErrors.neighborhood = 'La colonia es obligatoria';
        }
        break;

      case 1: // Construction
        if (!formData.construction?.type) {
          newErrors.type = 'El tipo constructivo es obligatorio';
        }
        if (!formData.construction?.usage) {
          newErrors.usage = 'El uso es obligatorio';
        }
        if (!formData.construction?.specificActivity?.trim()) {
          newErrors.specificActivity = 'El giro específico es obligatorio';
        }
        break;

      case 2: // Coverage
        const hasAtLeastOne = Object.values(formData.coverages).some((v) => (v || 0) > 0);
        if (!hasAtLeastOne) {
          newErrors.coverages = 'Debe especificar al menos una garantía con valor mayor a 0';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (!validateStep(activeStep)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000,
      });
      return;
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, validateStep]);

  const handlePrevious = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  }, [activeStep]);

  const handleStepClick = useCallback(
    (index: number) => {
      // Allow going to previous steps or validate current before going next
      if (index < activeStep) {
        setActiveStep(index);
      } else if (index === activeStep + 1) {
        handleNext();
      } else if (index > activeStep + 1) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Paso no disponible',
          detail: 'Complete los pasos anteriores primero',
          life: 3000,
        });
      }
    },
    [activeStep, handleNext]
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <PropertyLocationSection
            address={formData.address}
            propertyName={formData.name}
            onChange={handleLocationChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <PropertyConstructionSection
            construction={formData.construction}
            onChange={handleConstructionChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <PropertyCoverageSection
            coverages={formData.coverages}
            onChange={handleCoverageChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <PropertySummarySection
            property={{
              ...property,
              name: formData.name,
              address: formData.address,
              construction: formData.construction,
              coverages: formData.coverages,
            }}
            onSave={handleFinalSave}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Toast ref={toast} position="top-center" />

      {/* Stepper Header - Custom like QuoteOnboardingWizard */}
      <div className="bg-[#252540] rounded-lg p-4 border border-gray-700">
        <div className="w-full py-4">
          <div className="flex items-center justify-between relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#C9A84C] -translate-y-1/2 transition-all duration-500"
              style={{
                width: `${(activeStep / (steps.length - 1)) * 100}%`
              }}
            />

            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className="relative z-10 flex flex-col items-center cursor-pointer"
                >
                  {/* Step circle */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-lg
                      transition-all duration-300 border-2
                      ${isActive
                        ? 'bg-[#C9A84C] border-[#C9A84C] text-[#1A1A2E] scale-110'
                        : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-[#1A1A2E] border-gray-600 text-gray-400'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <i className="pi pi-check" />
                    ) : (
                      <span>{step.icon}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`
                        text-xs font-medium transition-colors duration-300
                        ${isActive ? 'text-[#C9A84C]' : isCompleted ? 'text-green-500' : 'text-gray-500'}
                      `}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      {step.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-[#252540] rounded-lg p-6 border border-gray-700">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      {activeStep < steps.length - 1 && (
        <div className="flex justify-between pt-4 border-t border-gray-700">
          <Button
            label="Anterior"
            icon="pi pi-arrow-left"
            onClick={handlePrevious}
            disabled={activeStep === 0}
            className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          />

          <Button
            label="Siguiente"
            icon="pi pi-arrow-right"
            iconPos="right"
            onClick={handleNext}
            className="bg-[#C9A84C] hover:bg-[#B8983E] text-white border-none"
          />
        </div>
      )}
    </div>
  );
}
